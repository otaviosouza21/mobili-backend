"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pedidos extends Model {
    static associate(models) {
      // Verifique se o modelo ProdutoPedido está correto
      Pedidos.hasMany(models.ProdutoPedido, {
        foreignKey: "pedido_id",
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Pedidos.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      tipo_pedido_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Pedidos", // Nome do modelo com "P" maiúsculo
      tableName: "pedidos",
    }
  );
  return Pedidos; // Nome da classe deve coincidir com o modelName
};
