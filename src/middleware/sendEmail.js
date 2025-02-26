const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail() {
  try {
    const response = await fetch("http://localhost:3333/api/pedidos");

    if (!response.ok) throw new Error("Não foi possível buscar pedidos");

    const pedidos = await response.json();

    // Transformando pedidos em uma string HTML
    const pedidosHtml = pedidos
      .map(
        (pedido) => `
        <li>
          <string>Emissao</strong> ${pedido.data_emissao}  
          <strong>Número:</strong> ${pedido.numero} <br>
          <strong>Cliente:</strong> ${pedido.cliente_razao_social} <br>
          <strong>Cidade:</strong> ${pedido.cliente_cidade} <br>
          <strong>Total:</strong> R$ ${pedido.total.toFixed(2)}
        </li><br>`
      )
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
      to: "otaviosouzalu@gmail.com",
      subject: "Lista de Pedidos",
      html: `
        <h3>Lista de Pedidos</h3>
        <ul>${pedidosHtml}</ul>
      `,
    };

    // Esperar o envio do e-mail corretamente
    const info = await transporter.sendMail(mailOptions);
    console.log("Email Enviado:", info.response);
  } catch (error) {
    console.error("Erro ao enviar email:", error);
  }
}

module.exports = sendEmail;
