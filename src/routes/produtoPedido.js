const { Router } = require("express");
const ProdutoPedidoController = require("../controller/erp_controllers/pedidos/ProdutoPedidoController");

const produtoPedidoController = new ProdutoPedidoController();

const route = Router();

route.post("/api/produto-pedido", (req, res) => {produtoPedidoController.criaNovo(req,res)});
route.get("/api/produto-pedido", (req, res) => {produtoPedidoController.pegasTodosController(req,res)});

module.exports = route;
