import { Router } from "express";
import PedidoController from "../controllers/PedidoController.js";
import loginRequired from "../middlewares/loginRequired.js";
import authorizeRole from "../middlewares/authorizeRole.js";

const router = new Router();

// Criar pedido (colaborador)
router.post(
  "/",
  loginRequired,
  authorizeRole("colaborador", "admin"),
  PedidoController.store
);

// Listar pedidos (todos os perfis podem ver os próprios)
router.get("/", loginRequired, PedidoController.index);

// Atualizar status (somente almoxarife/admin)
// Atualizar status do pedido
router.put(
  "/:id/status",
  loginRequired,
  authorizeRole("admin", "almoxarife"),
  PedidoController.updateStatus
);

export default router;
