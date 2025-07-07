const { Router } = require("express");
const TinyController = require("../../controller/tiny/TinyController");

const tinyController = new TinyController();

const route = Router();

route.post("/api/webhook/new-nf", (req, res) => {

  tinyController.novaNotaFiscalWebhook(req, res);
  
});
route.get("/api/tiny-produtos-servicos", (req, res) => {
  tinyController.pegaProdutosServicos(req, res);
});
route.get("/api/tiny-auth", (req, res) => {
  tinyController.iniciarAutenticacao(req, res);
});
route.get("/api/redirect-uri", (req, res) => {
  tinyController.recebeRedirectCode(req, res);
});

route.post("/api/redirect-shopee", (req, res) => {
  console.log(req)
  return res.json({message: 'teste'})
});


module.exports = route;
