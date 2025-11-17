import { Router } from "express";
import SaidaController from "../controllers/SaidaController.js";
import loginRequired from "../middlewares/loginRequired.js";
import authorizeRole from "../middlewares/authorizeRole.js";

const router = new Router();

// Registrar saída
router.post(
  "/",
  loginRequired,
  authorizeRole("almoxarife", "admin"),
  SaidaController.store
);

// Listar saídas
router.get(
  "/",
  loginRequired,
  authorizeRole("almoxarife", "admin"),
  SaidaController.index
);

export default router;
