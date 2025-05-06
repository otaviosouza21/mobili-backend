const { Router } = require("express");
const TinyController = require("../../controller/tiny/TinyController");

const tinyController = new TinyController();

const route = Router();

route.get("/api/tiny-produtos-servicos", (req, res) => {tinyController.pegaProdutosServicos(req,res)});
route.post("/api/webhook/new-order", (req, res) => {tinyController.newOrderWebHook(req,res)});

module.exports = route;
