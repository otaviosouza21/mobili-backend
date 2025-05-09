const { Embalagem } = require("../models");

class ProdutosTinyServices {
  constructor() {
    super("Embalagens");
  }

  async criaVariosRegistros(registros) {
    return Embalagem.bulkCreate(registros);
  }
}

module.exports = MarkupServices;
