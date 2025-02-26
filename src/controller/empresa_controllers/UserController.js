const Controller = require("../../Controller.js");
const { createInflateRaw } = require("zlib");
const { sequelize } = require("../../../models/index.js");
const bcrypt = require('bcrypt');
const Usuario_Services = require("../../services/empresa_services/usuarios/UsuarioServices.js");

const usuarioServices = new Usuario_Services();

class UserController extends Controller {
  constructor() {
    super(usuarioServices);
  }

  async registerUserController(req, res) {
    const { email } = req.body;
    const bodyReq = req.body;

    try {
      const isTrue = await this.allowNull(req, res);

      if (!isTrue.status) {
        return res.status(500).json({
          message: "Preencha todos os campos necessários",
          campos: isTrue.campos,
          error: true,
        });
      }

      //Verifica se o usuario existe
      const userExist = await usuario_services.pegaUsuarioPorEmail(email);
      
      if(UsersEmpresa.status){
        return res.status(422).json({
            message: "Este cadastro já existe! Tente outro email",
            error: true
        })
      }

    
      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(bodyReq.password, salt)
      bodyReq.senha = senhaHash;

      //Chama o serviço para registrar o usuário
      


    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Erro ao buscar registro, contate o administrador do sistema",
        error: true,
      });
    }
  }
}

module.exports = UserController;
