import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import "./src/database/index.js";

import homeRoutes from "./src/routes/homeRoutes.js";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import tokenRoutes from "./src/routes/tokenRoutes.js";
import materialRoutes from "./src/routes/materialRoutes.js";
import entradaRoutes from "./src/routes/entradaRoutes.js";
import saidaRoutes from "./src/routes/saidaRoutes.js";
import pedidoRoutes from "./src/routes/pedidoRoutes.js";

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());
  }

  routes() {
    this.app.use("/", homeRoutes);
    this.app.use("/usuarios", usuarioRoutes);
    this.app.use("/tokens", tokenRoutes);
    this.app.use("/materiais", materialRoutes);
    this.app.use("/entradas", entradaRoutes);
    this.app.use("/saidas", saidaRoutes);
    this.app.use("/pedidos", pedidoRoutes);
  }
}

export default new App().app;
