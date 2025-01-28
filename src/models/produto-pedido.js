'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProdutoPedido extends Model {
    static associate(models) {
      // Corrigir o nome da classe no belongsTo
      ProdutoPedido.belongsTo(models.Pedidos, {
        foreignKey: 'pedido_id' // Certifique-se de que o campo foreignKey está correto
      });
    }
  }

  ProdutoPedido.init(
    {
      produto_id: DataTypes.INTEGER,
      pedido_id: DataTypes.INTEGER,
      preco_tabela: DataTypes.FLOAT,
      preco_liquido: DataTypes.FLOAT,
      quantidade: DataTypes.INTEGER,
      descricao_produto: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'ProdutoPedido', // Padronize para o singular aqui
      tableName: 'produto-pedido', // Seguindo a convenção snake_case para o nome da tabela
    }
  );

  return ProdutoPedido;
};
