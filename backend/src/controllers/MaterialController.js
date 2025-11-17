import Material from "../models/Material.js";

class MaterialController {
  // Cadastrar novo material
  async store(req, res) {
    try {
      // Somente admin e almoxarife podem cadastrar
      if (req.user.perfil !== "admin" && req.user.perfil !== "almoxarife") {
        return res.status(403).json({
          status: false,
          errors: [
            "Apenas administradores ou almoxarifes podem cadastrar materiais.",
          ],
        });
      }

      // cria e valida o novo material
      const novoMaterial = Material.build(req.body);
      await novoMaterial.validate();
      await novoMaterial.save();

      const { id, nome, unidade, quantidade_estoque } = novoMaterial;

      return res.status(201).json({
        status: true,
        msg: "Material cadastrado com sucesso.",
        material: { id, nome, unidade, quantidade_estoque },
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        errors: error.errors
          ? error.errors.map((e) => e.message)
          : [error.message],
      });
    }
  }
  // Listar todos os materiais
  async index(req, res) {
    try {
      const materiais = await Material.findAll({
        attributes: [
          "id",
          "nome",
          "descricao",
          "unidade",
          "quantidade_estoque",
        ],
        order: [["nome", "ASC"]],
      });

      return res.json({
        status: true,
        materiais,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        errors: [error],
      });
    }
  }

  // Atualizar material
  async update(req, res) {
    try {
      if (req.user.perfil !== "admin" && req.user.perfil !== "almoxarife") {
        return res.status(403).json({
          status: false,
          errors: [
            "Apenas administradores ou almoxarifes podem atualizar materiais.",
          ],
        });
      }

      const material = await Material.findByPk(req.params.id);

      if (!material) {
        return res.status(404).json({
          status: false,
          errors: ["Material não encontrado."],
        });
      }

      const atualizado = await material.update(req.body);

      return res.json({
        status: true,
        msg: "Material atualizado com sucesso.",
        material: atualizado,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        errors: [error.message],
      });
    }
  }

  // Excluir material (apenas admin)
  async delete(req, res) {
    try {
      if (req.user.perfil !== "admin") {
        return res.status(403).json({
          status: false,
          errors: ["Apenas administradores podem excluir materiais."],
        });
      }

      const material = await Material.findByPk(req.params.id);

      if (!material) {
        return res.status(404).json({
          status: false,
          errors: ["Material não encontrado."],
        });
      }

      await material.destroy();

      return res.json({
        status: true,
        msg: "Material excluído com sucesso.",
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        errors: [error.message],
      });
    }
  }
}

export default new MaterialController();
