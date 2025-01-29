const Controller = require('../../Controller.js')
const { createInflateRaw } = require('zlib');
const { sequelize } = require('../../../models/index.js');
const Usuario_Services = require('../../services/empresa_services/usuarios/UsuarioServices.js');


const usuarioServices = new Usuario_Services() 

class UserController extends Controller {
    constructor(){
        super(usuarioServices)
    }

  
   
}

module.exports = UserController