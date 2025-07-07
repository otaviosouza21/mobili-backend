const Controller = require("../Controller");
const nodemailer = require("nodemailer");

class ClientesController extends Controller {
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
}

module.exports = ClientesController;
