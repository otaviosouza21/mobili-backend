require("dotenv").config();

class TinyController {
  constructor() {
    this.API_TINY_URL = "https://api.tiny.com.br/api2";
    this.token = process.env.TOKEN_TINY;
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
      console.error("Erro em pegaPedidoPorId:", error.message);
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

  async newOrderWebHook(req, res) {
    const id = req.body?.dados?.id;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Não foi possível obter o ID do pedido." });
    }

    const pedidoCompleto = await this.pegaPedidoPorId(id);

    if (!pedidoCompleto) {
      return res
        .status(400)
        .json({ message: "Não foi possível obter os dados do pedido." });
    }

    const itens = pedidoCompleto?.retorno?.pedido?.itens;

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ message: "O pedido não possui itens." });
    }

    const id_produto = itens[0]?.item?.id_produto;

    if (!id_produto) {
      return res.status(400).json({ message: "ID do produto não encontrado." });
    }

    const produtoCompleto = await this.pegaProdutoPorId(id_produto);

    if (!produtoCompleto) {
      return res
        .status(500)
        .json({ message: "Não foi possível obter os dados do produto." });
    }

    return res.status(200).json({ status: true, data: produtoCompleto });
  }
}

module.exports = TinyController;
