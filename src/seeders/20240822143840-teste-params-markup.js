"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("markup-params", [
      {
        tipo: "Camara",
        markup_tab1: 40,
        markup_tab2: 60,
        markup_tab3: 30,
        markup_tab4: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipo: "Peça",
        markup_tab1: 50,
        markup_tab2: 60,
        markup_tab3: 70,
        markup_tab4: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("markup-params", null, {});
  }
};
