"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("empresaUsuarios", {
      empresa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empresas",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Adiciona chave primária composta
    await queryInterface.addConstraint("empresaUsuarios", {
      fields: ["empresa_id", "usuario_id"],
      type: "primary key",
      name: "PK_EmpresaUsuarios",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("empresaUsuarios");
  },
};
