const Controller = require('../../Controller.js')
const MarkupServices = require('../../../services/erp_services/produtos/MarkupServices.js')

const markupServices = new MarkupServices()


class MarkupController extends Controller {
    constructor(){
        super(markupServices)
    }

}

module.exports = MarkupController