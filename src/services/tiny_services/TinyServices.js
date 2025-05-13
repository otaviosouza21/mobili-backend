const { Token } = require("../../models");
const Services = require("../Services");

class TinyServices extends Services {
  constructor() {
    super("Token");
  }

  async criaVariosRegistros(registros) {
    return Token.bulkCreate(registros);
  }

  async criaRegistroToken(dadosDoRegistro) {
    return model[this.nomeModel].create(dadosDoRegistro);
  }

  async pegaUltimoToken() {
    try {
      const token = await Token.findOne({
        order: [["createdAt", "DESC"]],
      });

      return token;
    } catch (error) {
      console.error("Erro ao buscar o último token:", error.message);
      return null;
    }
  }
}

module.exports = TinyServices;
