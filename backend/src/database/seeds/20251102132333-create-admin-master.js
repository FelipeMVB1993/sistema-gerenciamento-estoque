"use strict";
const bcryptjs = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "usuarios",
      [
        {
          nome: "Admin Master",
          username: "admin",
          senha_hash: await bcryptjs.hash("123456", 8),
          perfil: "admin",
          ativo: true,
          solicitou_reativacao: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("usuarios", { username: "admin" }, {});
  },
};
