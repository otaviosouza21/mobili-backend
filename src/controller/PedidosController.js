const Controller = require('./Controller.js')
const PedidosServices = require('../services/PedidosServices.js')

const pedidosServices = new PedidosServices()


class PedidosController extends Controller {
    constructor(){
        super(pedidosServices)
    }

}

module.exports = PedidosController