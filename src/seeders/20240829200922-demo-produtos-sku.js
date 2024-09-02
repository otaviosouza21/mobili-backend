'use strict';

/** @type {import('sequelize-cli').Seed} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProdutosSku', [
      {
        codigo_sku: '01.0002',
        descricao_sku: 'PNEU 1 TESTE',
        custo_sku: 18.35,
        preco_tab1_sku: 27.18,
        preco_tab2_sku: 24.06,
        preco_tab3_sku: 23.14,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        codigo_sku: '01.0001',
        descricao_sku: 'PNEU 2 TESTE',
        custo_sku: 20.35,
        preco_tab1_sku: 27.18,
        preco_tab2_sku: 24.06,
        preco_tab3_sku: 23.14,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        codigo_sku: '02.0001',
        descricao_sku: 'PEÇA 2 TESTE',
        custo_sku: 9.90,
        preco_tab1_sku: 15.18,
        preco_tab2_sku: 14.06,
        preco_tab3_sku: 10.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        codigo_sku: '02.0002',
        descricao_sku: 'PEÇA 1 TESTE',
        custo_sku: 10.00,
        preco_tab1_sku: 20.18,
        preco_tab2_sku: 18.06,
        preco_tab3_sku: 16.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProdutosSku', null, {});
  }
};
