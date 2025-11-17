"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("saidas_itens", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_saida: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "saidas", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_material: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "materiais", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      quantidade: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Adiciona o índice após criar a tabela
    await queryInterface.addIndex("saidas_itens", ["id_saida"]);
    await queryInterface.addIndex("saidas_itens", ["id_material"]);
  },

  async down(queryInterface) {
    // Remove os índices no rollback
    await queryInterface.removeIndex("saidas_itens", ["id_saida"]);
    await queryInterface.removeIndex("saidas_itens", ["id_material"]);
    await queryInterface.dropTable("saidas_itens");
  },
};
