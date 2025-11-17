import Sequelize, { Model } from "sequelize";

export default class EntradaItem extends Model {
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
        modelName: "EntradaItem",
        tableName: "entradas_itens",
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Entrada, {
      foreignKey: "id_entrada",
      as: "entrada",
    });
    this.belongsTo(models.Material, {
      foreignKey: "id_material",
      as: "material",
    });
  }
}
