import Entrada from "../models/Entrada.js";
import EntradaItem from "../models/EntradaItem.js";
import Material from "../models/Material.js";

class EntradaController {
  // Registrar entrada de materiais
  async store(req, res) {
    try {
      const { materiais, observacao } = req.body;
      const id_almoxarife = req.user.id;

      // Somente admin e almoxarife podem registrar entradas
      if (req.user.perfil !== "admin" && req.user.perfil !== "almoxarife") {
        return res.status(403).json({
          status: false,
          errors: [
            "Apenas administradores ou almoxarifes podem registrar entradas.",
          ],
        });
      }

      if (!materiais || materiais.length === 0) {
        return res.status(400).json({
          status: false,
          errors: ["Nenhum material informado."],
        });
      }

      // Cria a entrada
      const entrada = await Entrada.create({
        id_almoxarife,
        observacao,
        data_hora: new Date(),
      });

      // Adiciona os itens e atualiza o estoque
      for (const item of materiais) {
        const material = await Material.findByPk(item.id_material);

        if (!material) {
          return res.status(400).json({
            status: false,
            errors: [`Material ID ${item.id_material} não encontrado.`],
          });
        }

        await EntradaItem.create({
          id_entrada: entrada.id,
          id_material: item.id_material,
          quantidade: item.quantidade,
        });

        // Atualiza o estoque (soma)
        material.quantidade_estoque += parseFloat(item.quantidade);
        await material.save();
      }

      return res.status(201).json({
        status: true,
        msg: "Entrada registrada com sucesso.",
        entrada_id: entrada.id,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        errors: [error.message],
      });
    }
  }

  // Listar todas as entradas
  async index(req, res) {
    try {
      const entradas = await Entrada.findAll({
        include: [
          { association: "almoxarife", attributes: ["id", "nome", "username"] },
          { association: "itens", include: ["material"] },
        ],
        order: [["data_hora", "DESC"]],
      });

      return res.json({ status: true, entradas });
    } catch (error) {
      return res.status(400).json({ status: false, errors: [error.message] });
    }
  }
}

export default new EntradaController();
