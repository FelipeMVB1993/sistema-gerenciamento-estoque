import Usuario from "../models/Usuario.js";

class UsuarioController {
  // 🔹 Criar novo usuário (apenas admin)
  async store(req, res) {
    try {
      if (req.user.perfil !== "admin") {
        return res.status(403).json({
          status: false,
          errors: ["Apenas administradores podem criar novos usuários."],
        });
      }

      if (req.body.perfil === "admin") {
        return res.status(403).json({
          status: false,
          errors: ["Não é permitido criar outro administrador pelo sistema."],
        });
      }

      const novoUsuario = Usuario.build(req.body);
      await novoUsuario.validate();
      await novoUsuario.save();

      const { id, nome, username, perfil, ativo } = novoUsuario;

      return res.status(201).json({
        status: true,
        msg: "Usuário cadastrado com sucesso.",
        usuario: { id, nome, username, perfil, ativo },
      });
    } catch (erro) {
      return res.status(400).json({
        status: false,
        errors: erro.errors
          ? erro.errors.map((e) => e.message)
          : [erro.message],
      });
    }
  }

  // 🔹 Listar usuários ou apenas os que solicitaram reativação
  async index(req, res) {
    try {
      const { solicitacoes } = req.query;
      let where = {};

      if (solicitacoes === "true") {
        where = { solicitou_reativacao: true, ativo: false };
      }

      const usuarios = await Usuario.findAll({
        where,
        attributes: [
          "id",
          "nome",
          "username",
          "perfil",
          "ativo",
          "solicitou_reativacao",
        ],
        order: [["id", "ASC"]],
      });

      return res.json({ status: true, usuarios });
    } catch (error) {
      return res.status(500).json({ status: false, errors: [error.message] });
    }
  }

  // 🔹 Mostrar dados de um usuário específico
  async show(req, res) {
    try {
      const { id } = req.params;

      // Permite apenas visualizar o próprio perfil ou se for admin
      if (req.user.perfil !== "admin" && parseInt(id, 10) !== req.user.id) {
        return res.status(403).json({
          status: false,
          errors: ["Você não tem permissão para visualizar este usuário."],
        });
      }

      const usuario = await Usuario.findByPk(id, {
        attributes: [
          "id",
          "nome",
          "username",
          "perfil",
          "ativo",
          "solicitou_reativacao",
        ],
      });

      if (!usuario) {
        return res.status(404).json({
          status: false,
          errors: ["Usuário não encontrado."],
        });
      }

      return res.json({
        status: true,
        usuario,
      });
    } catch (erro) {
      return res.status(400).json({
        status: false,
        errors: [erro.message],
      });
    }
  }

  // 🔹 Atualizar dados de um usuário
  async update(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({
          status: false,
          errors: ["Usuário não encontrado."],
        });
      }

      // Apenas admin pode alterar perfil
      if (req.body.perfil && req.user.perfil !== "admin") {
        return res.status(403).json({
          status: false,
          errors: [
            "Apenas administradores podem alterar o perfil de usuários.",
          ],
        });
      }

      await usuario.update(dados);

      return res.json({
        status: true,
        msg: "Usuário atualizado com sucesso.",
        usuario,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        errors: [error.message],
      });
    }
  }

  // 🔹 Solicitação de reativação (usuário inativo)
  async solicitarReativacao(req, res) {
    try {
      const { username } = req.body;

      const usuario = await Usuario.findOne({ where: { username } });
      if (!usuario) {
        return res
          .status(404)
          .json({ status: false, errors: ["Usuário não encontrado."] });
      }

      if (usuario.ativo) {
        return res
          .status(400)
          .json({ status: false, errors: ["Usuário já está ativo."] });
      }

      if (usuario.solicitou_reativacao) {
        return res
          .status(400)
          .json({ status: false, errors: ["Solicitação já enviada."] });
      }

      usuario.solicitou_reativacao = true;
      await usuario.save();

      return res.json({
        status: true,
        msg: "Solicitação de reativação enviada com sucesso!",
      });
    } catch (error) {
      return res.status(500).json({ status: false, errors: [error.message] });
    }
  }

  // 🔹 Admin aprova reativação
  async reativar(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res
          .status(404)
          .json({ status: false, errors: ["Usuário não encontrado."] });
      }

      usuario.ativo = true;
      usuario.solicitou_reativacao = false;
      await usuario.save();

      return res.json({
        status: true,
        msg: "Usuário reativado com sucesso.",
      });
    } catch (error) {
      return res.status(500).json({ status: false, errors: [error.message] });
    }
  }

  // 🔹 Admin nega solicitação de reativação
  async negarReativacao(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res
          .status(404)
          .json({ status: false, errors: ["Usuário não encontrado."] });
      }

      usuario.solicitou_reativacao = false;
      await usuario.save();

      return res.json({
        status: true,
        msg: "Solicitação de reativação negada.",
      });
    } catch (error) {
      return res.status(500).json({ status: false, errors: [error.message] });
    }
  }
}

export default new UsuarioController();
