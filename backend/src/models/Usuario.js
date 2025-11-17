import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

export default class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: {
            msg: "Nome de usuário já existe.",
          },
        },
        senha_hash: {
          type: Sequelize.STRING,
        },
        senha: {
          type: Sequelize.VIRTUAL,
          validate: {
            len: {
              args: [6, 50],
              msg: "A senha deve ter entre 6 e 50 caracteres.",
            },
          },
        },
        perfil: {
          type: Sequelize.ENUM("admin", "almoxarife", "colaborador"),
          allowNull: false,
          defaultValue: "colaborador",
        },
        ativo: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        solicitou_reativacao: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: "Usuario",
        tableName: "usuarios",
      }
    );

    this.addHook("beforeSave", async (usuario) => {
      if (usuario.senha) {
        usuario.senha_hash = await bcrypt.hash(usuario.senha, 8);
      }
    });

    return this;
  }

  senhaValida(senhaDigitada) {
    return bcrypt.compare(senhaDigitada, this.senha_hash);
  }

  static associate(models) {
    // Saídas registradas pelo usuário (como almoxarife)
    this.hasMany(models.Saida, {
      foreignKey: "id_almoxarife",
      as: "saidas_registradas",
    });

    // Saídas em que o usuário é o colaborador (requerente)
    this.hasMany(models.Saida, {
      foreignKey: "id_requerente",
      as: "saidas_realizadas",
    });

    // Entradas de material registradas pelo usuário (almoxarife/admin)
    this.hasMany(models.Entrada, {
      foreignKey: "id_almoxarife",
      as: "entradas_registradas",
    });
  }
}
