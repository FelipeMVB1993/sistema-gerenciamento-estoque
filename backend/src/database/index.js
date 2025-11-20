import Sequelize from "sequelize";
import databaseConfig from "../config/database.js";

// Models principais
import Usuario from "../models/Usuario.js";
import Material from "../models/Material.js";

// Movimentações de saída
import Saida from "../models/Saida.js";
import SaidaItem from "../models/SaidaItem.js";

// Movimentações de entrada
import Entrada from "../models/Entrada.js";
import EntradaItem from "../models/EntradaItem.js";

// Movimentações de pedido
import Pedido from "../models/Pedido.js";
import PedidoItem from "../models/PedidoItem.js";

const models = [
  Usuario,
  Material,
  Entrada,
  EntradaItem,
  Saida,
  SaidaItem,
  Pedido,
  PedidoItem,
];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));

models.forEach((model) => {
  if (model.associate) model.associate(connection.models);
});

export default connection;
