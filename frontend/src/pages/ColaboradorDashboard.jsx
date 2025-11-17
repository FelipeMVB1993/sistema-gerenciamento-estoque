import Title from "../components/Title";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

export default function ColaboradorDashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-8 bg-slate-100 overflow-auto">
        <Title>Painel do Colaborador</Title>

        <p className="text-slate-600 mb-8 text-center">
          Bem-vindo! Aqui você pode solicitar materiais e acompanhar o status
          dos seus pedidos.
        </p>

        {/* Cards de Acesso Rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            to="/colaborador/cadastrar-pedidos"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-center items-center"
          >
            <h2 className="text-lg font-semibold text-slate-700">
              Cadastrar Pedido
            </h2>
            <p className="text-sm text-slate-500 text-center mt-2">
              Solicite materiais necessários.
            </p>
          </Link>

          <Link
            to="/colaborador/listar-pedidos"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-center items-center"
          >
            <h2 className="text-lg font-semibold text-slate-700">
              Meus Pedidos
            </h2>
            <p className="text-sm text-slate-500 text-center mt-2">
              Veja o status dos pedidos.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
