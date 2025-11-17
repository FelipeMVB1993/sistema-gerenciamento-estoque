import bcrypt from "bcryptjs";
import Saida from "../models/Saida.js";
import SaidaItem from "../models/SaidaItem.js";
import Material from "../models/Material.js";
import Usuario from "../models/Usuario.js";
import Pedido from "../models/Pedido.js";

class SaidaController {
  // 🔹 Registrar saída de materiais (somente almoxarife/admin)
  async store(req, res) {
    try {
      const {
        id_requerente,
        senha_requerente,
        observacao,
        materiais,
        id_pedido,
      } = req.body;

      // Verifica se o usuário logado é almoxarife ou admin
      if (!["almoxarife", "admin"].includes(req.user.perfil)) {
        return res.status(403).json({
          status: false,
          errors: [
            "Apenas almoxarifes ou administradores podem registrar saídas.",
          ],
        });
      }

      // Verifica se o colaborador existe
      const colaborador = await Usuario.findByPk(id_requerente);
      if (!colaborador) {
        return res.status(404).json({
          status: false,
          errors: ["Colaborador não encontrado."],
        });
      }

      // Verifica a senha do colaborador
      const senhaOk = await bcrypt.compare(
        senha_requerente,
        colaborador.senha_hash
      );
      if (!senhaOk) {
        return res.status(401).json({
          status: false,
          errors: ["Senha do colaborador incorreta."],
        });
      }

      // Cria o registro da saída
      const saida = await Saida.create({
        id_almoxarife: req.user.id,
        id_requerente,
        observacao,
      });

      // Itera pelos materiais enviados
      for (const item of materiais) {
        const material = await Material.findByPk(item.id_material);

        if (!material) {
          continue; // se o material não existir, pula o loop
        }

        if (material.quantidade_estoque < item.quantidade) {
          return res.status(400).json({
            status: false,
            errors: [`Estoque insuficiente para o material: ${material.nome}`],
          });
        }

        // Registra o item da saída
        await SaidaItem.create({
          id_saida: saida.id,
          id_material: item.id_material,
          quantidade: item.quantidade,
        });

        // Atualiza o estoque
        material.quantidade_estoque -= item.quantidade;
        await material.save();
      }

      // Atualiza o status do pedido, se informado
      if (id_pedido) {
        const pedido = await Pedido.findByPk(id_pedido);
        if (pedido) {
          pedido.status = "aprovado";
          await pedido.save();
        }
      }

      return res.status(201).json({
        status: true,
        msg: "Saída registrada e estoque atualizado com sucesso.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        errors: ["Erro ao registrar saída."],
      });
    }
  }

  // 🔹 Listar saídas (admin e almoxarife)
  async index(req, res) {
    try {
      if (!["almoxarife", "admin"].includes(req.user.perfil)) {
        return res.status(403).json({
          status: false,
          errors: [
            "Apenas almoxarifes e administradores podem visualizar saídas.",
          ],
        });
      }

      const saidas = await Saida.findAll({
        include: [
          {
            model: Usuario,
            as: "almoxarife",
            attributes: ["id", "nome", "username"],
          },
          {
            model: Usuario,
            as: "requerente",
            attributes: ["id", "nome", "username"],
          },
          {
            model: SaidaItem,
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
        order: [["id", "DESC"]],
      });

      return res.json({
        status: true,
        saidas,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        errors: ["Erro ao listar saídas."],
      });
    }
  }
}

export default new SaidaController();
