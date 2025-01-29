'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProdutoPedido extends Model {
    static associate(models) {
      // Corrigir o nome da classe no belongsTo
      ProdutoPedido.belongsTo(models.Pedidos, {
        foreignKey: 'pedido_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'// Certifique-se de que o campo foreignKey está correto
      });
    }
  }

  ProdutoPedido.init(
    {
      produto_id: DataTypes.INTEGER,
      pedido_id: DataTypes.INTEGER,
      produto_codigo: DataTypes.STRING,
      tabela_preco_id: DataTypes.INTEGER,
      preco_tabela: DataTypes.FLOAT,
      preco_liquido: DataTypes.FLOAT,
      quantidade: DataTypes.INTEGER,
      produto_nome: DataTypes.STRING,
      st: DataTypes.FLOAT
    },
    {
      sequelize,
      modelName: 'ProdutoPedido', // Padronize para o singular aqui
      tableName: 'produto-pedido', // Seguindo a convenção snake_case para o nome da tabela
    }
  );

  return ProdutoPedido;
};
