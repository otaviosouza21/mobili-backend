const { Router } = require("express");
 const ClientesController = require("../../controller/mercos_controllers/ClientesController");

const clientesController = new ClientesController();
 
const route = Router();

route.post("/api/webhook/cliente-update", (req, res) => {clientesController.recebeAtualizacoCliente(req,res)});

module.exports = route;
