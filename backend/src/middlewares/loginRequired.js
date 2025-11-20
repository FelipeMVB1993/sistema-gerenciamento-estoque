import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: false,
      errors: ["Token não fornecido."],
    });
  }

  const [, token] = authorization.split(" ");

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, username } = dados;

    const usuario = await Usuario.findOne({
      where: { id, username },
      attributes: ["id", "username", "perfil", "ativo"],
    });

    if (!usuario) {
      return res.status(401).json({
        status: false,
        errors: ["Usuário não encontrado."],
      });
    }

    // Novo trecho — bloqueia usuários inativos
    if (!usuario.ativo) {
      return res.status(403).json({
        status: false,
        errors: ["Usuário inativo. Contate o administrador."],
      });
    }

    // Anexa o usuário ao req (para as rotas usarem)
    req.user = usuario;
    return next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({
      status: false,
      errors: ["Token inválido ou expirado."],
    });
  }
};
