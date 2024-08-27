const { Router } = require("express");
const ProdutosController = require("../controller/ProdutosController");

const produtosController = new ProdutosController();

const route = Router();

route.get("/api/produtos/sku/markup-params", (req, res) => {produtosController.pegasTodosController(req,res)});
route.put("/api/produtos/sku/markup-params/:id",(req,res)=> {produtosController.atulizaDadoController(req,res)} )


module.exports = route;
