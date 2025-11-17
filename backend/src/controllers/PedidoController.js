import Pedido from "../models/Pedido.js";
import PedidoItem from "../models/PedidoItem.js";
import Usuario from "../models/Usuario.js";
import Material from "../models/Material.js";

class PedidoController {
  // 🔹 Criar novo pedido (feito pelo colaborador)
  async store(req, res) {
    try {
      const { observacao, materiais } = req.body;

      if (!materiais || materiais.length === 0) {
        return res.status(400).json({
          status: false,
          errors: ["Adicione ao menos um material ao pedido."],
        });
      }

      const usuario = await Usuario.findByPk(req.user.id);
      if (!usuario || usuario.perfil !== "colaborador") {
        return res.status(403).json({
          status: false,
          errors: ["Apenas colaboradores podem criar pedidos."],
        });
      }

      // Cria o pedido
      const pedido = await Pedido.create({
        id_requerente: req.user.id,
        observacao,
        status: "pendente",
      });

      // Cria os itens do pedido
      for (const item of materiais) {
        const material = await Material.findByPk(item.id_material);
        if (!material) {
          return res.status(404).json({
            status: false,
            errors: [`Material ID ${item.id_material} não encontrado.`],
          });
        }

        await PedidoItem.create({
          id_pedido: pedido.id,
          id_material: material.id,
          quantidade: item.quantidade,
        });
      }

      return res.status(201).json({
        status: true,
        msg: "Pedido criado com sucesso.",
        pedido: {
          id: pedido.id,
          observacao,
          status: pedido.status,
        },
      });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      return res.status(500).json({
        status: false,
        errors: ["Erro interno ao criar o pedido."],
      });
    }
  }

  // 🔹 Listar todos os pedidos
  async index(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.user.id);

      if (!usuario) {
        return res.status(404).json({
          status: false,
          errors: ["Usuário não encontrado."],
        });
      }

      // 🔸 Admin e Almoxarife veem todos os pedidos
      // 🔸 Colaborador vê apenas os próprios
      const where =
        usuario.perfil === "colaborador"
          ? { id_requerente: usuario.id }
          : undefined;

      const pedidos = await Pedido.findAll({
        where,
        include: [
          {
            model: Usuario,
            as: "requerente",
            attributes: ["id", "nome", "username"],
          },
          {
            model: PedidoItem,
            as: "itens",
            include: [
              {
                model: Material,
                as: "material",
                attributes: ["id", "nome", "unidade"],
              },
            ],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return res.json({
        status: true,
        pedidos,
      });
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      return res.status(500).json({
        status: false,
        errors: ["Erro interno ao listar pedidos."],
      });
    }
  }

  // 🔹 Atualizar o status de um pedido (feito por admin ou almoxarife)
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const usuario = await Usuario.findByPk(req.user.id);
      if (!usuario || !["admin", "almoxarife"].includes(usuario.perfil)) {
        return res.status(403).json({
          status: false,
          errors: [
            "Apenas administradores e almoxarifes podem alterar status.",
          ],
        });
      }

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        return res.status(404).json({
          status: false,
          errors: ["Pedido não encontrado."],
        });
      }

      if (!["pendente", "aprovado", "negado"].includes(status)) {
        return res.status(400).json({
          status: false,
          errors: ["Status inválido. Use: pendente, aprovado ou negado."],
        });
      }

      pedido.status = status;
      await pedido.save();

      return res.json({
        status: true,
        msg: `Status do pedido atualizado para "${status}".`,
        pedido: {
          id: pedido.id,
          status: pedido.status,
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      return res.status(500).json({
        status: false,
        errors: ["Erro interno ao atualizar o status do pedido."],
      });
    }
  }
}

export default new PedidoController();
