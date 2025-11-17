import { useState, useEffect } from "react";
import Title from "../components/Title";
import Sidebar from "../components/Sidebar";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function RegistrarEntrada() {
  const { token } = useAuth();
  const [materiais, setMateriais] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [observacao, setObservacao] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Buscar materiais existentes
  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        const res = await fetch("http://localhost:3001/materiais", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status) setMateriais(data.materiais);
      } catch (err) {
        console.error("Erro ao buscar materiais:", err);
      }
    };
    fetchMateriais();
  }, [token]);

  // Atualiza quantidade selecionada
  const handleQuantidadeChange = (id, quantidade) => {
    setSelecionados((prev) => {
      const jaExiste = prev.find((m) => m.id_material === id);
      if (jaExiste) {
        return prev.map((m) =>
          m.id_material === id ? { ...m, quantidade } : m
        );
      } else {
        return [...prev, { id_material: id, quantidade }];
      }
    });
  };

  // Enviar entrada
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selecionados.length === 0) {
      return setMensagem("Selecione ao menos um material com quantidade.");
    }

    try {
      const res = await fetch("http://localhost:3001/entradas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          observacao,
          materiais: selecionados,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(
          data.errors?.join(", ") || "Erro ao registrar entrada."
        );
      }

      setMensagem("✅ Entrada registrada com sucesso!");
      setSelecionados([]);
      setObservacao("");
    } catch (error) {
      setMensagem(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-slate-100 p-6 overflow-auto">
        <Title>Registrar Entrada de Materiais</Title>

        {mensagem && (
          <div
            className={`p-3 mb-4 rounded text-sm ${
              mensagem.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {mensagem}
          </div>
        )}

        {materiais.length === 0 ? (
          <div className="bg-white shadow rounded-md overflow-hidden">
            <p className="p-4 text-slate-500 text-center">
              Nenhum material encontrado.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md space-y-4"
          >
            <label className="font-semibold text-slate-600">
              Observação (opcional):
            </label>
            <Input
              placeholder="Ex: Entrada de materiais comprados"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                Materiais Disponíveis:
              </h2>
              {materiais.map((mat) => (
                <div
                  key={mat.id}
                  className="flex justify-between items-center bg-slate-50 p-2 rounded border"
                >
                  <div>
                    {mat.nome}{" "}
                    <div className="text-xs text-slate-500">
                      ({mat.unidade})
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="Qtd"
                    className="border border-slate-300 rounded px-2 py-1 w-24"
                    onChange={(e) =>
                      handleQuantidadeChange(mat.id, parseFloat(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="mt-4">
              Registrar Entrada
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
