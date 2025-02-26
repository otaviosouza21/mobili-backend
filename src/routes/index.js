const express = require("express");
const cors = require("cors");
const pedidos = require("./pedidos.js");
const markup = require("./markup.js");
const bodyParser = require("body-parser");
const produtoPedido = require("./produtoPedido.js");
const email = require('./functions/email.js')
const usuarioEmpresa = require("./usuario.js");

module.exports = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(pedidos);
  app.use(markup);
  app.use(produtoPedido);
  app.use(email)
 /*  app.use(usuarioEmpresa); */
};


