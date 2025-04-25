const { Router } = require("express");
const ChatBotController = require("../../controller/chatbot/ChatbotController");

const chatBotController = new ChatBotController();

const route = Router();

route.post("/api/chatbot-webhook-servicos", (req, res) => {chatBotController.consultaServicos(req,res)});

module.exports = route;
