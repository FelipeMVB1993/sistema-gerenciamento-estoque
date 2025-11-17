import Sequelize, { Model } from "sequelize";

export default class Saida extends Model {
  static init(sequelize) {
    super.init(
      {
        data_hora: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        observacao: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Saida",
        tableName: "saidas",
      }
    );

    return this;
  }

  static associate(models) {
    // 🔹 Usuário que registrou a saída (almoxarife)
    this.belongsTo(models.Usuario, {
      foreignKey: "id_almoxarife",
      as: "almoxarife",
    });

    // 🔹 Usuário que retirou os materiais (requerente)
    this.belongsTo(models.Usuario, {
      foreignKey: "id_requerente",
      as: "requerente",
    });

    // 🔹 Itens da saída
    this.hasMany(models.SaidaItem, {
      foreignKey: "id_saida",
      as: "itens",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
