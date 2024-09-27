'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('pedidos', 'tipo_pedido_id', {
      type: Sequelize.INTEGER, // ou outro tipo de dado
      allowNull: true, // ou false, se a coluna não puder ser nula
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pedidos', 'tipo_pedido_id');
  }
};
