"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("markup-params", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.STRING,      
        allowNull: false,
      },
      markup_tab1: {
        type: Sequelize.FLOAT,      
      },
      markup_tab2: {
        type: Sequelize.FLOAT,      
      },
      markup_tab3: {
        type: Sequelize.FLOAT,      
      },
      markup_tab4: {
        type: Sequelize.FLOAT,      
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
    await queryInterface.dropTable("markup-params");
  },
};
