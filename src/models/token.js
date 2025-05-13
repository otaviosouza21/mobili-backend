"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {}
  }

  Token.init(
    {
      access_token: DataTypes.STRING,
      expires_in: DataTypes.INTEGER,
      refresh_expires_in: DataTypes.INTEGER,
      refresh_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Token", // <-- singular e capitalizado
      tableName: "tokens",
    }
  );

  return Token;
};
