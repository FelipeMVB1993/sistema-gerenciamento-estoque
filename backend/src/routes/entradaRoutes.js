import { Router } from "express";
import EntradaController from "../controllers/EntradaController.js";
import loginRequired from "../middlewares/loginRequired.js";
import authorizeRole from "../middlewares/authorizeRole.js";

const router = new Router();

// Registrar entrada
router.post(
  "/",
  loginRequired,
  authorizeRole("admin", "almoxarife"),
  EntradaController.store
);

// Listar entradas
router.get(
  "/",
  loginRequired,
  authorizeRole("admin", "almoxarife"),
  EntradaController.index
);

export default router;
