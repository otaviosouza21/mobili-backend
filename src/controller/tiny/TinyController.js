require("dotenv").config();
const Controller = require("../Controller");
const db = require("../../models");
const { dateNowConvert } = require("../../routes/functions/dateNowConvert");
const TinyServices = require("../../services/tiny_services/TinyServices");
const Embalagem = db.Embalagem;

const tinyServices = new TinyServices();

class TinyController extends Controller {
  constructor() {
    super();
    this.tinyServices = tinyServices;
    this.API_TINY_URL = "https://api.tiny.com.br/api2";
    this.API_TINT_URL_V3 = "https://api.tiny.com.br/public-api/v3";
    this.AUTH_URL =
      "https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/auth";
    this.TOKEN_URL =
      "https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/token";
    this.token = process.env.TOKEN_TINY;
    this.clientID = process.env.TINY_CLIENT_ID;
    this.secret = process.env.TINY_SECRET;
    this.redirectUri = process.env.TINY_REDIRECT_URI;
  }

  async pegaProdutosServicos(req, res) {
    try {
      const response = await fetch(
        `${this.API_TINY_URL}/produtos.pesquisa.php?token=${this.token}&formato=json`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
      }

      const data = await response.json();

      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async pegaPedidoPorId(id) {
    try {
      const response = await fetch(
        `${this.API_TINY_URL}/pedido.obter.php?token=${this.token}&formato=json&id=${id}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar pedido: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data?.retorno?.pedido) {
        throw new Error("Resposta do pedido inválida");
      }

      return data;
    } catch (error) {
      console.error("Erro em pegaPedidoPorId:", error.message + " " + id);
      return false;
    }
  }

  async pegaNFPorId(id) {
    try {
      const response = await fetch(
        `${this.API_TINY_URL}/nota.fiscal.obter.php?token=${this.token}&formato=json&id=${id}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar nota fiscal: ${response.statusText}`);
      }

      const data = await response.json();

      if (data?.retorno?.status !== "OK") {
        throw new Error("Resposta da NF inválida");
      }

      return data;
    } catch (error) {
      console.error("Erro em pegaNFPorId:", error.message + " " + id);
      return false;
    }
  }

  async pegaProdutoPorId(id) {
    try {
      const response = await fetch(
        `${this.API_TINY_URL}/produto.obter.php?token=${this.token}&formato=json&id=${id}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar produto: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data?.retorno?.produto) {
        throw new Error("Resposta do produto inválida");
      }

      return data;
    } catch (error) {
      console.error("Erro em pegaProdutoPorId:", error.message);
      return false;
    }
  }

  async pegaProdutoPorPesquisa(pesquisa) {
    try {
      const response = await fetch(
        `${this.API_TINY_URL}/produtos.pesquisa.php?token=${this.token}&formato=json&pesquisa=${pesquisa}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar produto: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data?.retorno?.produtos || data.retorno.produtos.length === 0) {
        throw new Error("Nenhum produto encontrado");
      }

      return data;
    } catch (error) {
      console.error("Erro em pegaProdutoPorPesquisa:", error.message);
      return false;
    }
  }

  async novaNotaFiscalWebhook(req, res) {
    const id = req.body?.dados?.idNotaFiscalTiny;

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID da nota fiscal não informado." });
    }

    const nfeCompleta = await this.pegaNFPorId(id);
    if (!nfeCompleta)
      return res.status(400).json({ message: "Falha ao obter a nota fiscal." });

    const idPedido = nfeCompleta?.retorno?.nota_fiscal?.id_venda;
    const pedidoDaNfe = await this.pegaPedidoPorId(idPedido);

    if (!pedidoDaNfe?.retorno?.pedido)
      return res.status(400).json({ message: "Pedido não encontrado." });

    const itens = pedidoDaNfe.retorno.pedido.itens;
    const id_produto = itens?.[0]?.item?.id_produto;

    if (!id_produto)
      return res.status(400).json({ message: "ID do produto não encontrado." });

    const produtoCompleto = await this.pegaProdutoPorId(id_produto);
    const { comprimentoEmbalagem, larguraEmbalagem } =
      produtoCompleto?.retorno?.produto || {};

    if (!comprimentoEmbalagem || !larguraEmbalagem)
      return res.status(400).json({ message: "Dimensões não encontradas." });

    const idEmbalagem = await this.buscaIdEmbalagemProduto({
      comprimentoEmbalagem,
      larguraEmbalagem,
    });
    if (!idEmbalagem)
      return res
        .status(400)
        .json({ message: "ID da embalagem não encontrado." });

    await this.AtualizaEstoquePorId(idEmbalagem, pedidoDaNfe);
    return res.status(200).json({ status: true, data: produtoCompleto });
  }

  async buscaIdEmbalagemProduto({ comprimentoEmbalagem, larguraEmbalagem }) {
    const embalagem = await Embalagem.findOne({
      where: { comprimento: comprimentoEmbalagem, largura: larguraEmbalagem },
    });
    if (!embalagem) return false;

    const embalagemTiny = await this.pegaProdutoPorPesquisa(embalagem.codigo);
    return embalagemTiny?.retorno?.produtos?.[0]?.produto?.id || false;
  }

  async PegaEstoquePorId(idProdutoTiny, token) {
    if (!idProdutoTiny) return false;

    try {
      const response = await fetch(
        `${this.API_TINT_URL_V3}/estoque/${idProdutoTiny}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro em PegaEstoquePorId:", error.message);
      return false;
    }
  }

  async AtualizaEstoquePorId(idProdutoTiny, pedidoDaNfe) {
    /*   const token = await this.refreshAccessToken(); */
    /*  const estoque = await this.PegaEstoquePorId(idProdutoTiny, this.token);
    const saldo = estoque?.produto?.saldo;
    if (saldo === undefined) return false;

    const quantidadeDeAjuste = saldo > 1 ? saldo - 1 : 1; */
    const dataFormatadaAtual = dateNowConvert();
    const {numero} = pedidoDaNfe.retorno.pedido;

    const url = "https://api.tiny.com.br/api2/produto.atualizar.estoque.php";

    const params = new URLSearchParams();
    params.append("token", this.token);
    params.append("formato", "XML");
    params.append(
      "estoque",
      ` <estoque>
          <idProduto>${idProdutoTiny}</idProduto>
          <tipo>S</tipo>
          <data>${dataFormatadaAtual}</data>
          <quantidade>1</quantidade>
          <precoUnitario>0.80</precoUnitario>
          <observacoes>Referente ao pedido ${numero}</observacoes>
          <deposito>marketplace</deposito>
        </estoque>
        `.trim()
    );

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Resposta:", data);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  }

  /*   async iniciarAutenticacao(req, res) {
    const authUrl = `${this.AUTH_URL}?client_id=${this.clientID}&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_type=code&scope=openid`;
    return res.redirect(authUrl);
  }

  async recebeRedirectCode(req, res) {
    const code = req.query.code;
    if (!code) return res.status(400).json({ error: "Código de autorização não recebido" });

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientID,
      client_secret: this.secret,
    });

    try {
      const response = await fetch(this.TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const data = await response.json();
      if (!response.ok) return res.status(500).json({ error: data });

      await this.criaRegistroToken(data);
      return res.status(200).json({ message: "Token recebido com sucesso", token: data });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async criaRegistroToken(data) {
    try {
      const tokenExistente = await this.tinyServices.pegaUltimoToken();
      if (tokenExistente) {
        await tokenExistente.update(data);
        return tokenExistente;
      } else {
        return await this.tinyServices.criaRegistro(data);
      }
    } catch (error) {
      console.error("Erro ao criar ou atualizar token:", error.message);
      return null;
    }
  }

  async refreshAccessToken() {
    try {
      const tokenRegistro = await this.tinyServices.pegaUltimoToken();
      if (!tokenRegistro) throw new Error("Nenhum token encontrado no banco de dados.");

      const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokenRegistro.refresh_token,
        client_id: this.clientID,
        client_secret: this.secret,
      });

      const response = await fetch(this.TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error_description || "Erro ao renovar access_token");

      await this.criaRegistroToken(data);
      return data.access_token;
    } catch (error) {
      console.error("Erro ao atualizar o token:", error.message);
      return null;
    }
  } */
}

module.exports = TinyController;
