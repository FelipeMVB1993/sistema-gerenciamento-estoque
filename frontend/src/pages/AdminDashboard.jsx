import { Link } from "react-router-dom";
import Title from "../components/Title";
import Sidebar from "../components/Sidebar";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-slate-100 overflow-auto">
        <Title>Painel do Administrador</Title>
        <p className="text-slate-600 mb-8 text-center">
          Bem-vindo! Aqui você pode gerenciar todo o sistema.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            to="/cadastrar-usuarios"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-center items-center"
          >
            <h2 className="text-lg font-semibold text-slate-700">
              Cadastrar Usuarios
            </h2>
            <p className="text-sm text-slate-500 text-center mt-2">
              Cadastre usuários que utilizarão o sistema.
            </p>
          </Link>
          <Link
            to="/cadastrar-materiais"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-center items-center"
          >
            <h2 className="text-lg font-semibold text-slate-700">
              Cadastrar Materiais
            </h2>
            <p className="text-sm text-slate-500 text-center mt-2">
              Cadastre materiais no sistema.
            </p>
          </Link>
          <Link
            to="/aprovar-pedidos"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-center items-center"
          >
            <h2 className="text-lg font-semibold text-slate-700">
              Aprovar Pedidos
            </h2>
            <p className="text-sm text-slate-500 text-center mt-2">
              Aprove e veja o status dos pedidos de materiais.
            </p>
          </Link>
          <Link
            to="/registrar-entrada"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-center items-center"
          >
            <h2 className="text-lg font-semibold text-slate-700">
              Registrar Materiais
            </h2>
            <p className="text-sm text-slate-500 text-center mt-2">
              Registrar quantidade de materiais no sistema.
            </p>
          </Link>
          <Link
            to="/listar-usuarios"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-center items-center"
          >
            <h2 className="text-lg font-semibold text-slate-700">
              Listar Usuários
            </h2>
            <p className="text-sm text-slate-500 text-center mt-2">
              Liste os usuários que estão cadastrados no sistema.
            </p>
          </Link>
          <Link
            to="/listar-materiais"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-center items-center"
          >
            <h2 className="text-lg font-semibold text-slate-700">
              Listar Materiais
            </h2>
            <p className="text-sm text-slate-500 text-center mt-2">
              Liste os materiais que estão cadastrados no sistema.
            </p>
          </Link>
          <Link
            to="/solicitacoes-reativacao"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-center items-center"
          >
            <h2 className="text-lg font-semibold text-slate-700">
              Reativar Usuários
            </h2>
            <p className="text-sm text-slate-500 text-center mt-2">
              Ative ou inative os usuários no sistema.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
