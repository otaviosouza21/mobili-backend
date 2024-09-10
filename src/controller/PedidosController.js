const Controller = require('./Controller.js')
const PedidosServices = require('../services/PedidosServices.js')
const notifier = require('node-notifier'); 

const pedidosServices = new PedidosServices()

class PedidosController extends Controller {
    constructor(){
        super(pedidosServices)
        this.pedidos = []
    }


    async getPedidos(req,res){
        try{
            if(this.pedidos === null) {
                return res.status(400).json({ message: `Não há nenhum pedido`});
            }

            return res.status(200).json(this.pedidos);
        } catch(error){
            return res.status(500).json({ message: `${error.message}`});
            
        }
    }


    async receberPedidos(req,res) {
        const data = req.body

        try{
            if(data === null) {
                return res.status(400).json({ message: `Não foi possivel obter dados`});
            }

            this.pedidos = [...this.pedidos,data]

            return res.status(200).json(this.pedidos);
        } catch(error){
            return res.status(500).json({ message: `${error.message}`});
            
        }
    }

}

module.exports = PedidosController