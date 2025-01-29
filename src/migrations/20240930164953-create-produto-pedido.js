'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('produto-pedido', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true, // Se quiser que o id seja auto-incrementado
        primaryKey: true // Marcar como chave primária
      },
      produto_id:{
        type: Sequelize.INTEGER
      },
      pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'pedidos',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      produto_codigo:{
        type: Sequelize.STRING
      },
      preco_tabela:{
        type: Sequelize.FLOAT
      },
      tabela_preco_id:{
        type: Sequelize.INTEGER
      },
      preco_liquido:{
        type: Sequelize.FLOAT
      },
      quantidade: {
        type: Sequelize.INTEGER
      },
      produto_nome: {
        type: Sequelize.STRING
      },
      st: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('produto-pedido');
  }
};