const express = require('express')
const cors = require('cors')
const pedidos = require('./pedidos.js')
const markup = require('./markup.js')
const bodyParser = require('body-parser');
const sku = require('./sku.js')


module.exports = (app) =>{
    app.use(cors());
    app.use(express.json())
    app.use(bodyParser.json());
    app.use(pedidos)
    app.use(markup)
    app.use(sku)
    
}



