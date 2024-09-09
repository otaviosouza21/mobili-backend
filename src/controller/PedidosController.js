const Controller = require('./Controller.js')
const PedidosServices = require('../services/PedidosServices.js')

const pedidosServices = new PedidosServices()


class PedidosController extends Controller {
    constructor(){
        super(pedidosServices)
    }

    async receberPedidos(req,res) {
        const data = req.body
        console.log(data);
    }

}

module.exports = PedidosController