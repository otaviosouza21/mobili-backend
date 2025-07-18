const { Router } = require("express");
 const MercosController = require("../../controller/mercos_controllers/MercosController");

const mercosController = new MercosController();
 
const route = Router();

route.post("/api/webhook/cliente-update", (req, res) => {mercosController.recebeAtualizacoCliente(req,res)});
route.post("/api/webhook/novo-pedido", (req, res) => {mercosController.recebeNovoPedido(req,res)});

module.exports = route;
