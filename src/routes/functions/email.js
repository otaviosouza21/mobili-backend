const { Router } = require("express");

const EmailController = require("../../controller/empresa_controllers/Email");

const emailController = new EmailController();

const route = Router();

route.post("/api/send-email-pedidos", (req, res) => {emailController.sendEmailPedidos(req,res)});

module.exports = route;