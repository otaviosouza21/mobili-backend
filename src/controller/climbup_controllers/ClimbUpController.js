require("dotenv").config();
const Controller = require("../Controller");
const TinyController = require("../tiny/TinyController");
const tinyController = new TinyController();

class ClimbUpController extends Controller {
  constructor() {
    super();
    this.API_CLIMBUP_URL = "https://api.wts.chat/chat/v1";
    this.API_CLIMBUP_TOKEN = process.env.API_CLIMBUP_TOKEN;
  }

  //webhook
  async consultarServico(req, res) {
    console.log(req.body);
    const pesquisa = req.body.lastMessagesAggregated.text;
    if (!pesquisa) return console.error("Não foi possivel obter a pesquisa");
    const retornoServico = await tinyController.pegaProdutoPorPesquisa(
      pesquisa
    );
    const { produtos } = retornoServico.retorno;
  
    if(produtos.length < 1) res.status(400).json({message: 'Não foi encontrado nenhum Serviço'}) 

    const requireObject = {
      text: "O valor do serviço é " + produtos[0].produto.preco,
      id: req.body.sessionId,
    };

    this.sendNewMessage(requireObject);

    return res.status(200).json({message: 'Serviço retornado com sucesso'}) 
  }

  async sendNewMessage(requireObject) {
    try {
      const response = await fetch(
        `${this.API_CLIMBUP_URL}/session/${requireObject.id}/message`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.API_CLIMBUP_TOKEN}`, 
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({
            text: requireObject.text,
          }),
        }
      );
 
      if (!response.ok) {
        throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem");
    }
  }
}

module.exports = ClimbUpController;
