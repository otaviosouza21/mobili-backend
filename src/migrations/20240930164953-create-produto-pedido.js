'use strict';
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
        }
      },
      preco_tabela:{
        type: Sequelize.FLOAT
      },
      preco_liquido:{
        type: Sequelize.FLOAT
      },
      quantidade: {
        type: Sequelize.INTEGER
      },
      descricao_produto: {
        type: Sequelize.STRING
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