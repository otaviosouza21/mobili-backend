const express = require('express')
const cors = require('cors')
const pedidos = require('./pedidos.js')
const produtos_sku = require('./produtos-sku.js')
const bodyParser = require('body-parser');
import { Express } from "express";

module.exports = (app:Express) =>{
    app.use(cors());
    app.use(express.json())
    app.use(bodyParser.json());
    app.use(pedidos)
    app.use(produtos_sku)
}



