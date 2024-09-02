const Controller = require('./Controller.js')
const SkuServices = require('../services/SkuServices.js')

const skuServices = new SkuServices()


class SkuController extends Controller {
    constructor(){
        super(skuServices)
    }

}

module.exports = SkuController