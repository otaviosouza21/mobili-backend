const express = require('express')
const sequelize = require('./config/config.js')
const routes = require('./routes/index.js')
const EmailControler = require('./controller/empresa_controllers/Email.js')

const emailController = new EmailControler()

const app = express()
routes(app)
emailController.SendEmailTimer()


sequelize.authenticate()
.then(()=>{
    console.log('Conexão estabelecida com sucesso');
})
.catch((err)=>{
    console.error('Não foi possivel conectar ao banco de dados', err)
})

module.exports = app;