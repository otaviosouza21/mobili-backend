'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class produtosku extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  produtosku.init({
    codigo_sku: DataTypes.STRING,
    custo_sku: DataTypes.FLOAT,
    preco_tab1_sku: DataTypes.FLOAT,
    preco_tab2_sku: DataTypes.FLOAT,
    preco_tab3_sku: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'produtosku',
    tableName:'ProdutosSku'
  });
  return produtosku;
};