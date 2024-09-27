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
    numero: DataTypes.INTEGER,
    cliente_razao_social: DataTypes.STRING,
    cliente_rua: DataTypes.STRING,
    cliente_numero: DataTypes.STRING,
    cliente_bairro: DataTypes.STRING,
    cliente_cidade: DataTypes.STRING,
    cliente_estado: DataTypes.STRING,
    cliente_cep: DataTypes.STRING,
    condicao_pagamento: DataTypes.STRING,
    data_emissao: DataTypes.DATE,
    tipo_pedido_id: DataTypes.INTEGER
  }, {
    sequelize,
     modelName: 'Pedidos',
    tableName:'pedidos'
  });
  return pedidos;
};