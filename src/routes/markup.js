const { Router } = require("express");
const MarkupController = require("../controller/MarkupController");

const markupController = new MarkupController();

const route = Router();

route.get("/api/produtos/markup-params", (req, res) => {markupController.pegasTodosController(req,res)});
route.put("/api/produtos/markup-params/:id",(req,res)=> {markupController.atulizaDadoController(req,res)} )


module.exports = route;
