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
    this.acessToken = process.env.TINY_ACESS_TOKEN;
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
        .json({ message: "Não foi possível obter o ID da nota fiscal." });
    }

    const nfeCompleta = await this.pegaNFPorId(id);

    if (!nfeCompleta) {
      return res
        .status(400)
        .json({ message: "Não foi possível obter a nota fiscal." });
    }

    const idPedido = nfeCompleta?.retorno?.nota_fiscal?.id_venda;

    const pedidoDaNfe = await this.pegaPedidoPorId(idPedido);

    if (pedidoDaNfe?.retorno.status !== "OK") {
      return res.status(400).json({
        message: "Não foi possível obter o pedido relacionado a NFE.",
      });
    }

    const itens = pedidoDaNfe?.retorno?.pedido?.itens;

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ message: "a NFE não possui itens." });
    }

    const id_produto = itens[0]?.item?.id_produto;

    if (!id_produto) {
      return res.status(400).json({ message: "ID do produto não encontrado." });
    }

    const produtoCompleto = await this.pegaProdutoPorId(id_produto);

    if (!produtoCompleto) {
      return res
        .status(400)
        .json({ message: "Não foi possível obter os dados do produto." });
    }

    const { comprimentoEmbalagem, larguraEmbalagem } =
      produtoCompleto.retorno.produto;

    if (!comprimentoEmbalagem || !larguraEmbalagem) {
      return res
        .status(400)
        .json({ message: "Não foi possivel buscar dimensões" });
    }

    const idEmbalagem = await this.buscaIdEmbalagemProduto({
      comprimentoEmbalagem,
      larguraEmbalagem,
    });

    if (!idEmbalagem) {
      return res
        .status(400)
        .json({ message: "Não foi possivel buscar id da embalagem" });
    }

    await this.AtualizaEstoquePorId(idEmbalagem, pedidoDaNfe);

    return res.status(200).json({ status: true, data: produtoCompleto });
  }

  async buscaIdEmbalagemProduto(dimensoes) {
    const embalagem = await Embalagem.findOne({
      where: {
        comprimento: dimensoes.comprimentoEmbalagem,
        largura: dimensoes.larguraEmbalagem,
      },
    });

    if (!embalagem) {
      console.error("Embalagem não encontrada no banco de dados");
      return false;
    }

    const embalagemTiny = await this.pegaProdutoPorPesquisa(
      embalagem.dataValues.codigo
    );

    const { id: idEmbalagem } = embalagemTiny.retorno.produtos[0].produto;

    if (!idEmbalagem) {
      console.error("Não foi possivel obter o ID da embalagem");
    }

    return idEmbalagem;
  }

  async PegaEstoquePorId(idProdutoTiny, token) {
    if (!idProdutoTiny) {
      console.error("ID do produto não fornecido");
      return false;
    }

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

      if (data?.retorno?.status === "Erro") {
        const erroRegistro =
          data?.retorno?.registros?.registro?.erros?.[0]?.erro ||
          data?.retorno?.erros?.[0]?.erro ||
          "Erro desconhecido";

        throw new Error(`Erro da API Tiny: ${erroRegistro}`);
      }

      return data;
    } catch (error) {
      console.error("Erro em PegaEstoquePorId:", error.message);
      return false;
    }
  }

  async AtualizaEstoquePorId(idProdutoTiny, pedidoDaNfe) {
    let token = this.acessToken; // Certifique-se de definir isso no seu serviço
    const { saldo } = await this.PegaEstoquePorId(idProdutoTiny, token);
    const depositoId = 731692721;
    const dataFormatadaAtual = dateNowConvert();
    const quantidadeDeAjuste = saldo > 1 ? saldo - 1 : 1;
    const numeroPedidoTiny = pedidoDaNfe?.retorno?.pedido.numero;
    const numeroPedidoEcommerce = pedidoDaNfe?.retorno?.pedido.numero_ecommerce;
    const bodyData = {
      produto: {
        id: idProdutoTiny,
      },
      deposito: {
        id: depositoId,
      },
      tipo: "S",
      data: dataFormatadaAtual, // data atual em formato "YYYY-MM-DD"
      quantidade: quantidadeDeAjuste,
      precoUnitario: 0.8,
      observacoes: `Embalagem do pedido ${numeroPedidoTiny} / ${numeroPedidoEcommerce} `,
    };

    if (saldo === undefined || saldo === null) {
      console.error("Saldo não retornado pela API");
      return false;
    }

    if (!depositoId) {
      console.error("Deposito para atualização não informado:");
    }

    if (!idProdutoTiny) {
      console.error("ID do produto não fornecido");
      return false;
    }

    try {
      const response = await fetch(
        `${this.API_TINT_URL_V3}/estoque/${idProdutoTiny}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      const data = await response.json();

      if (data?.retorno?.status === "Erro") {
        const erroRegistro =
          data?.retorno?.registros?.registro?.erros?.[0]?.erro ||
          data?.retorno?.erros?.[0]?.erro ||
          "Erro desconhecido";

        throw new Error(`Erro da API Tiny: ${erroRegistro}`);
      }
      console.log("Estoque da embalagem atualizado");
      return data;
    } catch (error) {
      console.error("Erro em AtualizaEstoquePorId:", error.message);
      return false;
    }
  }

  async iniciarAutenticacao(req, res) {
    const authUrl = `${this.AUTH_URL}?client_id=${
      this.clientID
    }&redirect_uri=${encodeURIComponent(
      this.redirectUri
    )}&response_type=code&scope=openid`;

    return res.redirect(authUrl);
  }

  async recebeRedirectCode(req, res) {
    const code = req.query.code;

    if (!code) {
      return res
        .status(400)
        .json({ error: "Código de autorização não recebido" });
    }

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", this.redirectUri);
    params.append("client_id", this.clientID);
    params.append("client_secret", this.secret);

    try {
      const response = await fetch(this.TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(500).json({ error: data });
      }

      // Aqui você salva o access_token no banco, ou em memória, ou no arquivo .env

      this.criaRegistroToken(data);

      return res
        .status(200)
        .json({ message: "Token recebido com sucesso", token: data });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async criaRegistroToken(data) {
    try {
      const tokenExistente = await this.tinyServices.pegaUltimoToken();
      console.log(tokenExistente);
      if (tokenExistente) {
        // Atualiza o registro existente
        await tokenExistente.update({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in,
          token_type: data.token_type,
        });
        return tokenExistente;
      } else {
        // Cria novo registro
        const token = await this.tinyServices.criaRegistro(data);
        return token;
      }
    } catch (error) {
      console.error("Erro ao criar ou atualizar token:", error.message);
      return null;
    }
  }

  async refreshAccessToken() {
    try {
      const tokenRegistro = await this.tinyServices.pegaUltimoToken();

      if (!tokenRegistro) {
        throw new Error("Nenhum token encontrado no banco de dados.");
      }

      const refreshToken = tokenRegistro.refresh_token;

      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", refreshToken);
      params.append("client_id", this.clientID);
      params.append("client_secret", this.secret);

      const response = await fetch(this.TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error_description || "Erro ao renovar access_token"
        );
      }

      // Atualiza o token no banco
      await this.tinyServices.criaRegistro(data);

      this.acessToken = data.access_token;

      console.log("Novo access token atualizado com sucesso.");
      return data.access_token;
    } catch (error) {
      console.error("Erro ao atualizar o token:", error.message);
      return null;
    }
  }
}

module.exports = TinyController;
