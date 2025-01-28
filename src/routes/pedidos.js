const { Router } = require("express");
const PedidosController = require("../controller/erp_controllers/pedidos/PedidosController");

const pedidosController = new PedidosController();

const route = Router();

route.post("/api/webhook", (req, res) => {pedidosController.receberPedidos(req,res)});
route.post("/api/produtos-pedidos", (req, res) => {pedidosController.criaNovo(req,res)});
route.get("/api/pedidos", (req, res) => {pedidosController.pegasTodosController(req,res)});

module.exports = route;
