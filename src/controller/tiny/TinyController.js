class TinyController {
    constructor() {}
  
    async pegaProdutosServicos(req, res) {
      const API_TINY_URL = "https://api.tiny.com.br/api2";
      try {
        const response = await fetch(
          API_TINY_URL +
            `/produtos.pesquisa.php?token=6180cc9acd3554872cff455cec6797b680fe84770db17832c491a6fd16709333&formato=json&pagina=1`
        );
  
        const data = await response.json(); // <- aqui estava o problema
      
  
        return res.status(200).json({ data });
      } catch (error) {
        return res.status(500).json({ message: `${error.message}` });
      }
    }
  }
module.exports = TinyController;
