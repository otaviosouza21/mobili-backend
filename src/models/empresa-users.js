"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UsersEmpresa extends Model {
    static associate(models) {
   
    }
  }
  UsersEmpresa.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: false,
        primaryKey: true, // Definir como chave primária
      },
      nome: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      senha: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: "UsersEmpresa", // Nome do modelo com "P" maiúsculo
      tableName: "usersEmpresa",
    }
  );
  return UsersEmpresa; // Nome da classe deve coincidir com o modelName
};
