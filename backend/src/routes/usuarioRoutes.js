import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import loginRequired from "../middlewares/loginRequired.js";
import authorizeRole from "../middlewares/authorizeRole.js";

const router = new Router();

// Criar usuário (admin)
router.post(
  "/",
  loginRequired,
  authorizeRole("admin"),
  UsuarioController.store
);

// Listar usuários ou solicitações
router.get(
  "/",
  loginRequired,
  authorizeRole("admin", "almoxarife"),
  UsuarioController.index
);

// Mostrar usuário
router.get("/:id", loginRequired, UsuarioController.show);

// Atualizar usuário
router.put("/:id", loginRequired, UsuarioController.update);

// Solicitar reativação (público)
router.post("/solicitacoes-reativacao", UsuarioController.solicitarReativacao);

// Reativar (admin)
router.put(
  "/:id/reativar",
  loginRequired,
  authorizeRole("admin"),
  UsuarioController.reativar
);

// Negar reativação (admin)
router.put(
  "/:id/negar-reativacao",
  loginRequired,
  authorizeRole("admin"),
  UsuarioController.negarReativacao
);

export default router;
