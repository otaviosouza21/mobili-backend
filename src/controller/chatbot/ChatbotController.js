class ChatbotController {
  constructor() {}

  async consultaServicos(req, res) {
    const { lastMessage } = req.body;

    try {
      const URL = "http://amaisciclo.com.br:3333/api/tiny-produtos-servicos";
      const response = await fetch(URL);
      const data = await response.json();
      console.log(data);
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }
}

module.exports = ChatbotController;
