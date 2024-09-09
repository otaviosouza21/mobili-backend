const Controller = require('./Controller.js')
const PedidosServices = require('../services/PedidosServices.js')
const notifier = require('node-notifier'); 

const pedidosServices = new PedidosServices()

class PedidosController extends Controller {
    constructor(){
        super(pedidosServices)
    }

    async receberPedidos(req,res) {
        const data = req.body
        try{
            if(data === null || !data.dados || !data.dados.numero) {
                return res.status(400).json({ message: `Não foi possivel obter dados`});
            }

            notifier.notify({
                title: 'Novo Pedido Mercos',
                message: `Número do Pedido: ${data.dados.numero}`,
                sound: true, // Pode ser ajustado conforme necessário
                wait: true, // Espera até o usuário interagir com a notificação
            })

            return res.status(200).json({ message: `Pedido recepcionado ${data.dados.numero}`, data: data.dados});
        } catch(error){
            return res.status(500).json({ message: `${error.message}`});
            
        }
    }

}

module.exports = PedidosController