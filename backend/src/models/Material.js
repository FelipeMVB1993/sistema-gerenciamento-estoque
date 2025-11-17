import Sequelize, { Model } from "sequelize";

export default class Material extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        descricao: Sequelize.TEXT,
        unidade: Sequelize.STRING,
        quantidade_estoque: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "Material",
        tableName: "materiais",
      }
    );

    return this;
  }

  static associate(models) {
    // Entradas (materiais que entraram no estoque)
    this.hasMany(models.EntradaItem, {
      foreignKey: "id_material",
      as: "entradas_itens",
    });

    // (materiais que saíram do estoque)
    this.hasMany(models.SaidaItem, {
      foreignKey: "id_material",
      as: "saidas_itens",
    });

    // Pedidos feitos com este material
    if (models.PedidoItem) {
      this.hasMany(models.PedidoItem, {
        foreignKey: "id_material",
        as: "pedidos_itens",
      });
    }
  }
}
