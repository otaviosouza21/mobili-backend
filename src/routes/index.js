const express = require("express");
const cors = require("cors");
const pedidos = require("./pedidos.js");
const markup = require("./markup.js");
const bodyParser = require("body-parser");
const produtoPedido = require("./produtoPedido.js");
const email = require("./functions/email.js");
const climbup = require("./climbup/climbup-routes.js");
const tiny = require("./tiny/tiny-routes.js");
const mercos = require("./mercos/mercos-routes.js");

module.exports = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(pedidos);
  app.use(markup);
  app.use(produtoPedido);
  app.use(email);
  app.use(tiny);
  app.use(climbup);
  app.use(mercos)
  /*  app.use(usuarioEmpresa); */
};
