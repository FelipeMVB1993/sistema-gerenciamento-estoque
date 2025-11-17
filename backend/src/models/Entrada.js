import Sequelize, { Model } from "sequelize";

export default class Entrada extends Model {
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
        modelName: "Entrada",
        tableName: "entradas",
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, {
      foreignKey: "id_almoxarife",
      as: "almoxarife",
    });

    this.hasMany(models.EntradaItem, {
      foreignKey: "id_entrada",
      as: "itens",
    });
  }
}
