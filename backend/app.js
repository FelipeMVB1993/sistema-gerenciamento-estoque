import dotenv from "dotenv";
dotenv.config();
const cors = require("cors");
import "./src/database";
import express from "express";

import homeRoutes from "./src/routes/homeRoutes";
import usuarioRoutes from "./src/routes/usuarioRoutes";
import tokenRoutes from "./src/routes/tokenRoutes";
import materialRoutes from "./src/routes/materialRoutes";
import entradaRoutes from "./src/routes/entradaRoutes";
import saidaRoutes from "./src/routes/saidaRoutes";
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
  }

  routes() {
    this.app.use(cors());
    this.app.use("/", homeRoutes);
    this.app.use("/usuarios/", usuarioRoutes);
    this.app.use("/tokens/", tokenRoutes);
    this.app.use("/materiais/", materialRoutes);
    this.app.use("/entradas/", entradaRoutes);
    this.app.use("/saidas/", saidaRoutes);
    this.app.use("/pedidos/", pedidoRoutes);
  }
}

export default new App().app;
