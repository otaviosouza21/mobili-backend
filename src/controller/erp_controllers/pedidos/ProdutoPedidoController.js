const Controller = require('../../Controller.js')
const ProdutoPedidoServices = require('../../../services/erp_services/pedidos/ProdutoPedidoServices.js')
const { log } = require('console')

const produtoPedidoServices = new ProdutoPedidoServices()


class ProdutoPedidoController extends Controller {
    constructor(){
        super(produtoPedidoServices)
        this.produtoPedidoServices = produtoPedidoServices
    }

    async CriarProdutosPedidos(items){
     
        const novosProdutosPedidos = await produtoPedidoServices.criaVariosRegistros(items)
    }


}

module.exports = ProdutoPedidoController