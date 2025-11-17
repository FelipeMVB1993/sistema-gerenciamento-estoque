import Sequelize, { Model } from "sequelize";

export default class Pedido extends Model {
  static init(sequelize) {
    super.init(
      {
        observacao: Sequelize.TEXT,
        status: {
          type: Sequelize.ENUM("pendente", "aprovado", "negado"),
          defaultValue: "pendente",
        },
      },
      {
        sequelize,
        modelName: "Pedido",
        tableName: "pedidos",
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, {
      foreignKey: "id_requerente",
      as: "requerente",
    });
    this.hasMany(models.PedidoItem, {
      foreignKey: "id_pedido",
      as: "itens",
    });
  }
}
