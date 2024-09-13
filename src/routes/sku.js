const { Router } = require("express");
const SkuController = require("../controller/SkuController");

const skuController = new SkuController();

const route = Router();

route.post("/api/produtos/sku", (req, res) => {skuController.criaVarios(req,res)});
route.get("/api/produtos/sku", (req, res) => {skuController.pegasTodosController(req,res)});
route.put("/api/produtos/sku/:id",(req,res)=> {skuController.atulizaDadoController(req,res)} )


module.exports = route;
