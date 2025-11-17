import { Router } from "express";
import MaterialController from "../controllers/MaterialController.js";
import loginRequired from "../middlewares/loginRequired.js";
import authorizeRole from "../middlewares/authorizeRole.js";

const router = new Router();

/**
 * 📦 Rotas de Materiais
 */

// 🧱 Cadastrar novo material → admin ou almoxarife
router.post(
  "/",
  loginRequired,
  authorizeRole("admin", "almoxarife"),
  MaterialController.store
);

// Listar todos os materiais → qualquer usuário logado
router.get("/", loginRequired, MaterialController.index);

// Atualizar material → admin ou almoxarife
router.put(
  "/:id",
  loginRequired,
  authorizeRole("admin", "almoxarife"),
  MaterialController.update
);

// Excluir material → apenas admin
router.delete(
  "/:id",
  loginRequired,
  authorizeRole("admin"),
  MaterialController.delete
);

export default router;
