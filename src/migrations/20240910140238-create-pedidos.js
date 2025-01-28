'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: false, // Se quiser que o id seja auto-incrementado
        primaryKey: true // Marcar como chave primária
      },
      total: {
        type: Sequelize.FLOAT
      },
      numero:{
        type: Sequelize.INTEGER
      },
      cliente_razao_social: {
        type: Sequelize.STRING
      },
      cliente_rua:{
        type: Sequelize.STRING
      },
      cliente_numero:{
        type: Sequelize.STRING
      },
      cliente_bairro:{
        type: Sequelize.STRING
      },
      cliente_cidade:{
        type: Sequelize.STRING
      },
      cliente_estado:{
        type: Sequelize.STRING
      },
      cliente_cep:{
        type: Sequelize.STRING
      },
      data_emissao: {
        type: Sequelize.DATE
      },
      condicao_pagamento:{
        type: Sequelize.STRING
      },
      tipo_pedido_id:{
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pedidos');
  }
};