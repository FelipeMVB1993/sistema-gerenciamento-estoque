import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function SolicitacoesReativacao() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const res = await fetch(
          "http://localhost:3001/usuarios?solicitacoes=true",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.status) setUsuarios(data.usuarios);
      } catch {
        setUsuarios([]);
      }
    };
    fetchSolicitacoes();
  }, [token]);

  const aprovarReativacao = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/usuarios/${id}/reativar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.status) {
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        setMensagem("✅ Usuário reativado com sucesso!");
      } else {
        setMensagem(`❌ ${data.errors?.[0] || "Erro ao reativar."}`);
      }
    } catch {
      setMensagem("❌ Erro ao reativar usuário.");
    }
  };

  const negarReativacao = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3001/usuarios/${id}/negar-reativacao`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (data.status) {
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        setMensagem("🚫 Solicitação negada com sucesso!");
      } else {
        setMensagem(`❌ ${data.errors?.[0] || "Erro ao negar solicitação."}`);
      }
    } catch {
      setMensagem("❌ Erro ao negar solicitação.");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-slate-100 overflow-auto">
        <Title>Solicitações de Reativação</Title>

        {/* 🔹 Mensagem de feedback */}
        <AnimatePresence>
          {mensagem && (
            <motion.div
              key="msg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className={`p-3 mt-4 rounded text-sm text-center shadow ${
                mensagem.includes("✅")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : mensagem.includes("🚫")
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {mensagem}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔹 Tabela de solicitações */}
        {usuarios.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow rounded-md overflow-hidden mt-4"
          >
            <p className="p-4 text-slate-500 text-center">
              Nenhuma solicitação pendente.
            </p>
          </motion.div>
        ) : (
          <table className="w-full mt-4 bg-white rounded shadow">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-2">Nome</th>
                <th className="p-2">Usuário</th>
                <th className="p-2">Perfil</th>
                <th className="p-2">Ativar</th>
                <th className="p-2">Negar</th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody>
                {usuarios.map((u) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="border-b text-center"
                  >
                    <td className="p-2 font-medium">{u.nome}</td>
                    <td className="p-2">{u.username}</td>
                    <td className="p-2 capitalize">{u.perfil}</td>
                    <td className="p-2">
                      <Button
                        onClick={() => aprovarReativacao(u.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Ativar
                      </Button>
                    </td>
                    <td className="p-2">
                      <Button
                        onClick={() => negarReativacao(u.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Negar
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </table>
        )}
      </div>
    </div>
  );
}
