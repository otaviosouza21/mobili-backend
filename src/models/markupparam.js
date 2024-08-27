'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MarkupParam extends Model {
 
    static associate(models) {
      // define association here
    }
  }
  MarkupParam.init({
    tipo: DataTypes.STRING,
    markup_tab1: DataTypes.FLOAT,
    markup_tab2: DataTypes.FLOAT,
    markup_tab3: DataTypes.FLOAT,
    markup_tab4: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'MarkupParam',
    tableName:'markup-params'
  });
  return MarkupParam;
};