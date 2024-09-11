'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pedidos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pedidos.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true, // Definir como chave primária
    },
    total: DataTypes.FLOAT,
    pedido: DataTypes.INTEGER,
    cliente_razao_social: DataTypes.STRING,
    emissao: DataTypes.DATE
  }, {
    sequelize,
     modelName: 'Pedidos',
    tableName:'pedidos'
  });
  return pedidos;
};