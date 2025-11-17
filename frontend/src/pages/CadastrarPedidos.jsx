import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function CadastrarPedidos() {
  const { token } = useAuth();
  const [materiais, setMateriais] = useState([]);
  const [observacao, setObservacao] = useState("");
  const [itens, setItens] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Busca os materiais disponíveis
  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        const res = await fetch("http://localhost:3001/materiais", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status) setMateriais(data.materiais);
      } catch (error) {
        console.error("Erro ao carregar materiais:", error);
      }
    };
    fetchMateriais();
  }, [token]);

  const adicionarItem = () => {
    setItens([...itens, { id_material: "", quantidade: "" }]);
  };

  const removerItem = (index) => {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  };

  const atualizarItem = (index, campo, valor) => {
    const novos = [...itens];
    novos[index][campo] = valor;
    setItens(novos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setLoading(true);

    try {
      const body = {
        observacao,
        materiais: itens.map((i) => ({
          id_material: i.id_material,
          quantidade: i.quantidade,
        })),
      };

      const res = await fetch("http://localhost:3001/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.errors?.join(", ") || "Erro ao enviar pedido.");
      }

      setMensagem("✅ Pedido enviado com sucesso!");
      setObservacao("");
      setItens([]);
    } catch (error) {
      setMensagem(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-slate-100 overflow-auto">
        <Title>Solicitação de Materiais</Title>

        <div className="bg-white p-6 rounded shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Observação */}
            <div>
              <label className="block mb-1 text-slate-600 font-medium">
                Observação:
              </label>
              <Input
                type="text"
                placeholder="Ex: Solicitação para o laboratório de informática"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>

            {/* Itens do pedido */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-slate-700">
                  Itens do Pedido
                </h2>
                <Button type="button" onClick={adicionarItem}>
                  + Adicionar Item
                </Button>
              </div>

              {itens.length === 0 && (
                <p className="text-sm text-slate-500">
                  Nenhum item adicionado.
                </p>
              )}

              {itens.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 mb-3 bg-slate-50 p-3 rounded-md"
                >
                  <select
                    className="border border-slate-300 rounded-md p-2 w-1/2"
                    value={item.id_material}
                    onChange={(e) =>
                      atualizarItem(index, "id_material", e.target.value)
                    }
                  >
                    <option value="">Selecione um material</option>
                    {materiais.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.nome} ({mat.unidade})
                      </option>
                    ))}
                  </select>

                  <Input
                    type="number"
                    placeholder="Qtd"
                    value={item.quantidade}
                    onChange={(e) =>
                      atualizarItem(index, "quantidade", e.target.value)
                    }
                    className="w-24"
                  />

                  <button
                    type="button"
                    onClick={() => removerItem(index)}
                    className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <Button type="submit" disabled={loading || itens.length === 0}>
              {loading ? "Enviando Pedido..." : "Enviar Pedido"}
            </Button>

            {mensagem && (
              <div
                className={`p-3 rounded text-sm ${
                  mensagem.includes("✅")
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {mensagem}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
