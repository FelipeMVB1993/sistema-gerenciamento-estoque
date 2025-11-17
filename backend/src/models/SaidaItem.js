import Sequelize, { Model } from "sequelize";

export default class SaidaItem extends Model {
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
        modelName: "SaidaItem",
        tableName: "saidas_itens",
      }
    );

    return this;
  }

  static associate(models) {
    // 🔹 Referência à saída
    this.belongsTo(models.Saida, {
      foreignKey: "id_saida",
      as: "saida",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 🔹 Material vinculado ao item da saída
    this.belongsTo(models.Material, {
      foreignKey: "id_material",
      as: "material",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });
  }
}
