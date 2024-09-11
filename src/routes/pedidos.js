const { Router } = require("express");
const PedidosController = require("../controller/PedidosController");

const pedidosController = new PedidosController();

const route = Router();

route.post("/api/webhook", (req, res) => {pedidosController.receberPedidos(req,res)});
route.get("/api/pedidos", (req, res) => {pedidosController.pegasTodosController(req,res)});

module.exports = route;
