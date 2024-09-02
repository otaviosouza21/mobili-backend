const Controller = require('./Controller.js')
const MarkupServices = require('../services/MarkupServices.js')

const markupServices = new MarkupServices()


class MarkupController extends Controller {
    constructor(){
        super(markupServices)
    }

}

module.exports = MarkupController