export default function authorizeRole(...rolesPermitidos) {
  return (req, res, next) => {
    const user = req.user; // vem do middleware loginRequired

    if (!user) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    if (!rolesPermitidos.includes(user.perfil)) {
      return res.status(403).json({
        error: "Acesso negado. Você não tem permissão para essa operação.",
      });
    }

    next();
  };
}
