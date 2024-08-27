const Controller = require('./Controller.js')
const ProdutosServices = require('../services/ProdutosServices.js')

const produtosServices = new ProdutosServices()


class ProdutosController extends Controller {
    constructor(){
        super(produtosServices)
    }

}

module.exports = ProdutosController