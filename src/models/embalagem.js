"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Embalagem extends Model {
    static associate(models) {}
  }

  Embalagem.init(
    {
      codigo: DataTypes.STRING,
      largura: DataTypes.FLOAT,
      altura: DataTypes.FLOAT,
      comprimento: DataTypes.FLOAT,
      peso: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Embalagem",  // <-- singular e capitalizado
      tableName: 'embalagens',
    }
  );

  return Embalagem;
};
