const usuario = require("../../../models/usuario");
const Services = require("../../Services");

class Usuario_Services extends Services {
  constructor() {
    super("UsersEmpresa");
  }

  async pegaUsuarioPorEmail_Services(email) {
    const retorno = await usuario.findOne({
      where: { email },
      attributes: [
        "id",
        "nome",
        "email",
      ],
    });
  }
}

module.exports = Usuario_Services;
