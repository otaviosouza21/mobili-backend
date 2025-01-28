const Controller = require('../../Controller.js')
const PedidosServices = require('../../../services/erp_services/pedidos/PedidosServices.js')
const ProdutoPedidosController = require('../pedidos/ProdutoPedidoController.js')
const notifier = require('node-notifier'); 
const { createInflateRaw } = require('zlib');
const { sequelize } = require('../../../models/index.js');
const { log } = require('console');

const pedidosServices = new PedidosServices() 
const produtosPedidosController = new ProdutoPedidosController()


class PedidosController extends Controller {
    constructor(){
        super(pedidosServices)
        this.pedidos = []
        this.produtoPedidosController = produtosPedidosController
    }

  
    async receberPedidos(req,res) {
        const transaction = await sequelize.transaction()
        const data = req.body
        const {itens} = data.dados
        try{
            if(data === null) {
                return res.status(400).json({ message: `Não foi possivel obter dados`});
            }

            // Cria o pedido dentro da transação
            const novoPedido = await this.propsServices.criaRegistro(data.dados, {
                transaction
            })
               

            if(!novoPedido.id){
                throw new Error("Erro ao criar perguntas pois nao foi possivel obter a ID")
            }

            const produtosComVinculo = itens.map((item)=>({
                ...item,
                pedido_id: novoPedido.id
            }))

           

            const novoProdutoPedido = await this.produtoPedidosController.CriarProdutosPedidos(
                produtosComVinculo,
                { transaction } // Inclua a transação aqui
            );

            
             this.pedidos = [...this.pedidos,data]

            return res.status(200).json(this.pedidos);
        } catch(error){
            return res.status(500).json({ message: `${error.message}`});
            
        }
    }

}

module.exports = PedidosController