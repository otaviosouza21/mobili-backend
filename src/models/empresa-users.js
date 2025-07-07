"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmpresaUsuario extends Model {
    static associate(models) {
      // Associações opcionais se necessário
    }
  }

  EmpresaUsuario.init(
    {},
    {
      sequelize,
      modelName: "EmpresaUsuario",
      tableName: "empresaUsuarios",
      timestamps: true,
    }
  );

  return EmpresaUsuario;
};
