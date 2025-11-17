import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-100">
      <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Acesso negado</h1>
      <p className="text-gray-600 mb-6">
        Você não tem permissão para acessar esta página.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Voltar
      </button>
    </div>
  );
}
