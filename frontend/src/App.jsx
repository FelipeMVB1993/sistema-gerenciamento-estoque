import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";
import Login from "./components/Login";
import PrivateRoute from "./routes/PrivateRoute";

// Páginas
import AdminDashboard from "./pages/AdminDashboard";
import AlmoxarifeDashboard from "./pages/AlmoxarifeDashboard";
import ColaboradorDashboard from "./pages/ColaboradorDashboard";
import RegistrarEntrada from "./pages/RegistrarEntrada";
import AprovarPedidos from "./pages/AprovarPedidos";
import CadastrarPedidos from "./pages/CadastrarPedidos";
import PedidosListagem from "./pages/PedidosListagem";
import ListaUsuarios from "./pages/ListaUsuarios";
import MaterialList from "./pages/MaterialList";
import CadastroMateriais from "./pages/CadastrarMateriais";
import CadastrarUsuarios from "./pages/CadastrarUsuarios";
import SolicitacoesReativacao from "./pages/SolicitacoesReativacao";
import SolicitarReativacao from "./pages/SolicitarReativacao";
import AtualizarUsuario from "./pages/AtualizarUsuario";
import Unauthorized from "./pages/Unauthorized";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* LOGIN */}
          <Route path="/" element={<Login />} />
          <Route
            path="/solicitar-reativacao"
            element={<SolicitarReativacao />}
          />
          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/cadastrar-usuarios"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <CadastrarUsuarios />
              </PrivateRoute>
            }
          />
          <Route
            path="/listar-usuarios"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ListaUsuarios />
              </PrivateRoute>
            }
          />
          <Route
            path="/listar-materiais"
            element={
              <PrivateRoute allowedRoles={["admin", "almoxarife"]}>
                <MaterialList />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitacoes-reativacao"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <SolicitacoesReativacao />
              </PrivateRoute>
            }
          />

          {/* ALMOXARIFE */}
          <Route
            path="/almoxarife"
            element={
              <PrivateRoute allowedRoles={["almoxarife", "admin"]}>
                <AlmoxarifeDashboard />
              </PrivateRoute>
            }
          />

          {/* CADASTRO DE MATERIAIS */}
          <Route
            path="/cadastrar-materiais"
            element={
              <PrivateRoute allowedRoles={["almoxarife", "admin"]}>
                <CadastroMateriais />
              </PrivateRoute>
            }
          />

          {/* REGISTRO DE ENTRADAS */}
          <Route
            path="/registrar-entrada"
            element={
              <PrivateRoute allowedRoles={["almoxarife", "admin"]}>
                <RegistrarEntrada />
              </PrivateRoute>
            }
          />

          {/* APROVAÇÃO DE PEDIDOS */}
          <Route
            path="/aprovar-pedidos"
            element={
              <PrivateRoute allowedRoles={["almoxarife", "admin"]}>
                <AprovarPedidos />
              </PrivateRoute>
            }
          />
          <Route
            path="/atualizar-usuario"
            element={
              <PrivateRoute allowedRoles={["almoxarife", "colaborador"]}>
                <AtualizarUsuario />
              </PrivateRoute>
            }
          />
          {/* COLABORADOR */}
          <Route
            path="/colaborador"
            element={
              <PrivateRoute allowedRoles={["colaborador", "admin"]}>
                <ColaboradorDashboard />
              </PrivateRoute>
            }
          />

          {/* LISTAGEM DE PEDIDOS (colaborador, almoxarife e admin) */}
          <Route
            path="/colaborador/listar-pedidos"
            element={
              <PrivateRoute
                allowedRoles={["colaborador", "almoxarife", "admin"]}
              >
                <PedidosListagem />
              </PrivateRoute>
            }
          />
          <Route
            path="/colaborador/cadastrar-pedidos"
            element={
              <PrivateRoute allowedRoles={["colaborador", "admin"]}>
                <CadastrarPedidos />
              </PrivateRoute>
            }
          />

          {/* PÁGINA DE ACESSO NEGADO */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ROTA PADRÃO */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
