const { Router } = require("express");
const PedidosController = require("../controller/PedidosController");

const pedidosController = new PedidosController();

const route = Router();

route.get("/api/pedidos", (req, res) => {
  return res.json([
    {
      codigo: "01.0089",
      produto: "PNEU",
      custo: 400,
    },
    {
      codigo: "01.0100",
      produto: "QUADRO",
      custo: 200,
    },
  ]);
});

module.exports = route;
