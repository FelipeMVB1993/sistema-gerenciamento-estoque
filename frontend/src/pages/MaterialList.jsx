import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function MaterialList() {
  const { token } = useAuth();
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // 🔹 Buscar materiais ao carregar a página
  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3001/materiais", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status) {
          setMateriais(data.materiais);
        } else {
          throw new Error(
            data.errors?.join(", ") || "Erro ao buscar materiais"
          );
        }
      } catch (error) {
        setMensagem(`❌ ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMateriais();
  }, [token]);

  // 🔹 Excluir material
  const excluirMaterial = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este material?"))
      return;

    try {
      const res = await fetch(`http://localhost:3001/materiais/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.errors?.join(", ") || "Erro ao excluir material");
      }

      setMensagem("✅ Material excluído com sucesso!");
      setMateriais((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      setMensagem(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-slate-100 overflow-auto">
        <Title>Lista de Materiais</Title>

        {mensagem && (
          <div
            className={`p-3 rounded text-sm mb-4 ${
              mensagem.includes("✅")
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {mensagem}
          </div>
        )}

        {/* Tabela de Materiais */}
        <div className="bg-white shadow rounded-md overflow-hidden">
          {loading ? (
            <p className="p-4 text-slate-500 text-center">Carregando...</p>
          ) : materiais.length === 0 ? (
            <p className="p-4 text-slate-500 text-center">
              Nenhum material cadastrado.
            </p>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-200 text-slate-700 uppercase text-sm">
                <tr>
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Nome</th>
                  <th className="p-3 border-b">Descrição</th>
                  <th className="p-3 border-b">Unidade</th>
                  <th className="p-3 border-b text-center">Estoque</th>
                  <th className="p-3 border-b text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {materiais.map((material) => (
                  <tr
                    key={material.id}
                    className="hover:bg-slate-50 transition-all"
                  >
                    <td className="p-3 border-b">{material.id}</td>
                    <td className="p-3 border-b font-medium">
                      {material.nome}
                    </td>
                    <td className="p-3 border-b">
                      {material.descricao || "—"}
                    </td>
                    <td className="p-3 border-b">{material.unidade}</td>
                    <td className="p-3 border-b text-center">
                      {material.quantidade_estoque}
                    </td>
                    <td className="p-3 border-b text-center">
                      <Button
                        onClick={() => excluirMaterial(material.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
