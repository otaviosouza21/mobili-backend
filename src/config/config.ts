const {Sequelize} = require('sequelize')
const db = require('./database/db.js')

const sequelize = new Sequelize(
    db.development.database,
    db.development.username,  // Certifique-se de que `null` é passado
    db.development.password, // Certifique-se de que `null` é passado
    {
        host: db.development.host,
        port: db.development.port,
        dialect: db.development.dialect
    }
);

module.exports = sequelize