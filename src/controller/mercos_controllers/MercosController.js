const Controller = require("../Controller");
const nodemailer = require("nodemailer");
const {
  formatarDataHoraBR,
  formatarParaBRL,
} = require("../../routes/functions/dataFormat");

class MercosController extends Controller {
  async recebeAtualizacoCliente(req, res) {
    const cliente = req.body.dados;
    try {
      const emailEnviado = await this.sendEmail(cliente);
      if (emailEnviado) {
        return res.status(200).send({ message: "E-mail enviado com sucesso." });
      } else {
        return res.status(400).send({ error: "Falha ao enviar o e-mail." });
      }
    } catch (error) {
      console.error("Erro ao tentar enviar e-mail:", error);
      return res.status(500).send({ error: "Erro interno ao enviar e-mail." });
    }
  }

  async sendEmail(cliente) {
    try {
      const clienteHtml = `
            <li>
                <strong>Última Alteração:</strong> ${cliente.ultima_alteracao}<br>
                <strong>Cliente:</strong> ${cliente.razao_social}<br>
                <strong>CNPJ:</strong> ${cliente.cnpj}<br>
                <strong>Rua:</strong> ${cliente.rua}<br>
                <strong>Cidade:</strong> ${cliente.cidade}<br>
                <strong>Bairro:</strong> ${cliente.bairro}<br>
                <strong>Número:</strong> ${cliente.numero}<br>
                <strong>Estado:</strong> ${cliente.estado}<br>
                <strong>CEP:</strong> ${cliente.cep}<br>
            </li><br>`;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: "sistema@amaisciclo.com.br",
        subject: "Atualização de Cliente",
        html: `
        <h3>Cliente Atualizado</h3>
        <ul>${clienteHtml}</ul>
      `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("E-mail enviado:", info.response);
      return true;
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      return false;
    }
  }

  async recebeNovoPedido(req, res) {
    const pedido = req.body.dados;
    const items = pedido.itens || [];

    const contemItemPromocional = items.some(
      (item) => item.produto_codigo === "03.0085"
    );

    if (!items.length) {
      return res.status(400).send({ error: "Pedido sem itens." });
    }

    if (!contemItemPromocional) {
      return res.status(200).send({ message: "Pedido sem items de promoção" });
    }

    const itemPromocional = items.filter(
      (item) => item.produto_codigo === "03.0085"
    );

    const restantePedido = items.filter(
      (item) => item.produto_codigo !== "03.0085"
    );

    const valorPromocional = itemPromocional.reduce(
      (total, item) => total + item.subtotal,
      0
    );

  
    const valorRestante = restantePedido.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    
    const pedidoElegivel =
      itemPromocional.length > 0 && valorRestante >= valorPromocional;

    if (pedidoElegivel) {
      this.newOrderEmail(pedido, valorRestante, valorPromocional, 'PEDIDO ELEGIVEL');

    return res
        .status(200)
        .send({ message: "Pedido recebido com sucesso e é ELEGIVEL." });
    }

    this.newOrderEmail(pedido, valorRestante, valorPromocional, 'NÃO ELEGIVEL');

    return res
      .status(200)
      .send({ message: "Pedido recebido com sucesso, mas não é ELEGIVEL." });
  }

  async newOrderEmail(pedido, valorPecas, valorPromocao, tituloEmail) {
    try {
      const pedidoHtml = `
            <li>
                <strong>Criação:</strong> ${formatarDataHoraBR(
                  pedido.data_criacao
                )}<br>
                <strong>Pedido:</strong> ${pedido.numero}<br>
                <strong>Cliente:</strong> ${pedido.cliente_razao_social}<br>
                <strong>Outros:</strong> ${formatarParaBRL(valorPecas)}<br>
                <strong>Promoção:</strong> ${formatarParaBRL(valorPromocao)}<br>
                <strong>Total:</strong> ${formatarParaBRL(pedido.total)}<br>
            </li><br>`;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: "sistema@amaisciclo.com.br, comercial@amaisciclo.com.br",
        subject: `Pedido ${tituloEmail} - Gerado`,
        html: `
        <h3>Um novo pedido ${tituloEmail} gerado: #${pedido.numero}</h3>
        <ul>${pedidoHtml}</ul>
      `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("E-mail enviado:", info.response);
      return true;
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      return false;
    }
  }
}

module.exports = MercosController;
