const nodemailer = require("nodemailer");
const Controller = require("../Controller");
const cron = require("node-cron");
const { log } = require("console");
require("dotenv").config();

class EmailControler extends Controller {
  constructor() {
    super();
  }

  async sendEmailPedidos(req, res) {
    try {
      const response = await fetch(process.env.URL_API + `/pedidos`);

      if (!response.ok) throw new Error("Não foi possível buscar pedidos");
      const pedidos = await response.json();

      const now = new Date();
      const data12hAnterior = new Date(now);

      data12hAnterior.setDate(now.getDate() - 1);
      data12hAnterior.setHours(12, 0, 0, 0)

      // Ajustando para o horário local (no caso UTC-3 para Brasil)
      const offset = now.getTimezoneOffset() / 60; // Obtém a diferença do fuso horário em horas
      data12hAnterior.setHours(data12hAnterior.getHours() - offset); // Ajusta para o horário local

      const pedidosHtml = pedidos
        .filter((pedido) => {
          const dataEmissao = new Date(pedido.createdAt);
          // Verificando se o pedido foi emitido após as 12h do dia anterior
          return dataEmissao >= data12hAnterior;
        })
        .map((pedido) => {
          // Converte a data para um formato legível
          const dataEmissao = new Date(pedido.createdAt);
          const dataFormatada = dataEmissao.toLocaleDateString("pt-BR");
          return `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${dataFormatada}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${pedido.numero}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${pedido.cliente_razao_social}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${pedido.cliente_cidade}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">R$ ${pedido.total.toFixed(2)}</td>
            </tr>`;
        })
        .join("");

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
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
        to: "sistema@amaisciclo.com.br,comercial2@amaisciclo.com.br,comercial@amaisciclo.com.br",
        subject: "Relatorios diarios Lista de Pedidos",
        html: `
          <h3>Lista de Pedidos</h3>
          <p>Segue abaixo a tabela com os pedidos nas ultimas 24h</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Emissao</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Número</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cliente</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cidade</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${pedidosHtml}
            </tbody>
          </table>
        `,
      };

      // Esperar o envio do e-mail corretamente e capturar erros
      const info = await transporter.sendMail(mailOptions);
      console.log("Email Enviado", info.response);
      return res.status(200).json({ status: true, message: "Email Enviado" });
    } catch (error) {
      console.error("Erro ao enviar email:", error.message); // Log mais detalhado
      return res.status(500).json({ status: false, message: error.message });
    }
  }

  async SendEmailTimer() {
    cron.schedule("15 14 * * *", async () => {
      try {
        console.log("Iniciando o envio automatico de email...");

        const response = await fetch(process.env.URL_API + `/send-email-pedidos`,
          { method: "POST"}
        );

        if (!response.ok) throw new Error("Erro ao enviar email");

        console.log("Email enviado com sucesso");
      } catch (error) {
        console.error("Erro ao disparar o envio do email:", error.message); // Log detalhado do erro
      }
    });
  }
}

module.exports = EmailControler;
