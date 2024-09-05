'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('produtoskus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codigo_sku: {
        type: Sequelize.STRING
      },
      descricao_sku:{
        type: Sequelize.STRING
      },
      custo_sku: {
        type: Sequelize.FLOAT
      },
      preco_tab1_sku: {
        type: Sequelize.FLOAT
      },
      preco_tab2_sku: {
        type: Sequelize.FLOAT
      },
      preco_tab3_sku: {
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
    await queryInterface.dropTable('produtoskus');
  }
};