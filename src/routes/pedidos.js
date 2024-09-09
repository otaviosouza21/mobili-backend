const { Router } = require("express");
const PedidosController = require("../controller/PedidosController");

const pedidosController = new PedidosController();

const route = Router();

route.post("/api/pedidos", (req, res) => {pedidosController.receberPedidos(req,res)});

module.exports = route;
