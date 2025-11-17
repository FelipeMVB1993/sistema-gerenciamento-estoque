import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

class TokenController {
  async store(req, res) {
    try {
      const { username = "", senha = "" } = req.body;

      if (!username || !senha) {
        return res.status(400).json({
          status: false,
          errors: ["Preencha todos os campos obrigatórios."],
        });
      }

      const usuario = await Usuario.findOne({ where: { username } });

      if (!usuario) {
        return res.status(401).json({
          status: false,
          errors: ["Usuário não encontrado."],
        });
      }

      if (!(await usuario.senhaValida(senha))) {
        return res.status(401).json({
          status: false,
          errors: ["Senha incorreta."],
        });
      }

      const { id, perfil, ativo } = usuario;

      if (!ativo) {
        return res.status(403).json({
          status: false,
          errors: ["Usuário inativo. Contate o administrador."],
        });
      }

      const token = jwt.sign(
        { id, username, perfil, ativo },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION }
      );

      return res.json({
        status: true,
        msg: "Login realizado com sucesso.",
        token,
        usuario: { id, username, perfil, ativo },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        errors: [error],
      });
    }
  }
}

export default new TokenController();
