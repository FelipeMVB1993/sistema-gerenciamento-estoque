"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("entradas_itens", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_entrada: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "entradas", key: "id" },
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("entradas_itens");
  },
};
