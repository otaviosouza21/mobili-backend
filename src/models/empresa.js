"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Empresa extends Model {
    static associate(models) {
      Empresa.belongsToMany(models.Usuario, {
        through: "EmpresaUsuarios",
        foreignKey: "empresa_id",
        otherKey: "usuario_id",
      });
    }
  }

  Empresa.init(
    {
      razaoSocial: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nomeFantasia: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Empresa",
      tableName: "empresas",
      timestamps: true,
    }
  );

  return Empresa;
};
