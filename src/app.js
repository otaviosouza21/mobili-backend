const express = require('express')
const sequelize = require('./config/config.js')
const routes = require('./routes/index.js')


const app = express()
routes(app)


sequelize.authenticate()
.then(()=>{
    console.log('Conexão estabelecida com sucesso');
})
.catch((err)=>{
    console.error('Não foi possivel conectar ao banco de dados', err)
})

module.exports = app;