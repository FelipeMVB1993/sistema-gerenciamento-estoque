import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function ListaUsuarios() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Buscar lista de usuários
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:3001/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!data.status) {
          throw new Error(
            data.errors?.join(", ") || "Erro ao buscar usuários."
          );
        }

        setUsuarios(data.usuarios);
      } catch (error) {
        setMensagem(`❌ ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [token]);

  // 🔹 Ir para tela de edição
  const editarUsuario = (usuario) => {
    navigate("/cadastrar-usuarios", { state: { usuario } });
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-slate-100 overflow-auto">
        <Title>Lista de Usuários</Title>

        {mensagem && (
          <div
            className={`p-3 rounded text-sm mb-4 ${
              mensagem.includes("❌")
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {mensagem}
          </div>
        )}

        {loading ? (
          <p>Carregando usuários...</p>
        ) : (
          <div className="bg-white rounded shadow p-4 mt-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-200 text-slate-700">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">NOME</th>
                  <th className="p-2 text-left">USUÁRIO</th>
                  <th className="p-2 text-left">PERFIL</th>
                  <th className="p-2 text-left">ATIVO</th>
                  <th className="p-2 text-left">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {usuarios
                  .filter((usuario) => usuario.perfil !== "admin")
                  .map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition"
                    >
                      <td className="p-2">{usuario.id}</td>
                      <td className="p-2 font-semibold text-slate-700">
                        {usuario.nome}
                      </td>
                      <td className="p-2">{usuario.username}</td>
                      <td className="p-2 capitalize">{usuario.perfil}</td>
                      <td className="p-2">
                        {usuario.ativo ? (
                          <div className="text-green-600 font-medium flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full inline-block"></div>
                            Ativo
                          </div>
                        ) : (
                          <div className="text-red-600 font-medium flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full inline-block"></div>
                            Inativo
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <Button
                          onClick={() => editarUsuario(usuario)}
                          className="bg-slate-500 hover:bg-slate-600 text-white"
                        >
                          Atualizar Usuário
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
