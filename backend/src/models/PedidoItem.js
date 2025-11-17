import Sequelize, { Model } from "sequelize";

export default class PedidoItem extends Model {
  static init(sequelize) {
    super.init(
      {
        quantidade: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "PedidoItem",
        tableName: "pedidos_itens",
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Pedido, {
      foreignKey: "id_pedido",
      as: "pedido",
    });
    this.belongsTo(models.Material, {
      foreignKey: "id_material",
      as: "material",
    });
  }
}
