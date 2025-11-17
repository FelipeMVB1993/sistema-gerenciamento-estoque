import { useState, useEffect, useCallback } from "react";
import Title from "../components/Title";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../hooks/useAuth";

export default function AprovarPedidos() {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [senhaRequerente, setSenhaRequerente] = useState("");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  // Buscar pedidos (todos, não só pendentes)
  const fetchPedidos = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/pedidos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status) {
        setPedidos(data.pedidos);
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  // ✅ Atualiza pedido localmente sem precisar refazer a lista completa
  const atualizarStatusLocal = (id, novoStatus) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: novoStatus } : p))
    );
  };

  // ✅ Confirmar retirada → cria saída e aprova pedido
  const confirmarRetirada = async (pedido) => {
    setMensagem("");
    setLoading(true);

    try {
      const saidaBody = {
        id_requerente: pedido.id_requerente,
        senha_requerente: senhaRequerente,
        observacao: pedido.observacao,
        materiais: pedido.itens.map((item) => ({
          id_material: item.id_material,
          quantidade: item.quantidade,
        })),
      };

      const resSaida = await fetch("http://localhost:3001/saidas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(saidaBody),
      });

      const dataSaida = await resSaida.json();

      if (!resSaida.ok || !dataSaida.status) {
        throw new Error(
          dataSaida.errors?.join(", ") || "Erro ao criar a saída."
        );
      }

      // Atualiza status do pedido no backend
      const resPedido = await fetch(
        `http://localhost:3001/pedidos/${pedido.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "aprovado" }),
        }
      );

      const dataPedido = await resPedido.json();

      if (!resPedido.ok || !dataPedido.status) {
        throw new Error(
          dataPedido.errors?.join(", ") || "Erro ao atualizar status do pedido."
        );
      }

      // Atualiza localmente
      atualizarStatusLocal(pedido.id, "aprovado");
      setMensagem("✅ Pedido aprovado e saída registrada com sucesso!");
      setSenhaRequerente("");
      setPedidoSelecionado(null);
    } catch (error) {
      setMensagem(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Negar pedido
  const negarPedido = async (pedidoId) => {
    try {
      const res = await fetch(
        `http://localhost:3001/pedidos/${pedidoId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "negado" }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.errors?.join(", ") || "Erro ao negar pedido.");
      }

      // Atualiza localmente
      atualizarStatusLocal(pedidoId, "negado");
      setMensagem("⚠️ Pedido negado com sucesso.");
    } catch (error) {
      setMensagem(`❌ ${error.message}`);
    }
  };

  // ✅ Render
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-slate-100 overflow-auto">
        <Title>Gerenciamento de Pedidos</Title>

        {mensagem && (
          <div
            className={`p-3 mb-4 rounded text-sm ${
              mensagem.includes("✅")
                ? "bg-green-100 text-green-700 border border-green-300"
                : mensagem.includes("⚠️")
                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {mensagem}
          </div>
        )}
        {pedidos.length === 0 ? (
          <div className="bg-white shadow rounded-md overflow-hidden">
            <p className="p-4 text-slate-500 text-center">
              Nenhum pedido encontrado.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className={`bg-white p-4 rounded shadow border 
                ${
                  pedido.status === "aprovado"
                    ? "border-green-400"
                    : pedido.status === "negado"
                    ? "border-red-400"
                    : "border-yellow-400"
                }`}
              >
                <h2 className="text-lg font-semibold text-slate-700">
                  Pedido #{pedido.id}
                </h2>

                <p className="text-sm text-slate-500 mb-1">
                  <b>Requerente:</b> {pedido.requerente?.nome} (
                  {pedido.requerente?.username})
                </p>
                <p className="text-sm text-slate-500 mb-1">
                  <b>Observação:</b> {pedido.observacao || "—"}
                </p>
                <p
                  className={`text-sm font-medium mt-1 ${
                    pedido.status === "aprovado"
                      ? "text-green-600"
                      : pedido.status === "negado"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {pedido.status.toUpperCase()}
                </p>

                <h3 className="font-semibold text-slate-600 mt-3 mb-1">
                  Itens Solicitados:
                </h3>
                <ul className="pl-4 list-disc text-sm">
                  {pedido.itens.map((item, index) => (
                    <li key={index}>
                      {item.material.nome} ({item.quantidade}{" "}
                      {item.material.unidade})
                    </li>
                  ))}
                </ul>

                {/* Ações */}
                {pedido.status === "pendente" &&
                  (pedidoSelecionado?.id === pedido.id ? (
                    <div className="mt-4 bg-slate-50 p-3 rounded">
                      <label className="block mb-1 text-slate-600 text-sm">
                        Digite a senha do colaborador:
                      </label>
                      <Input
                        type="password"
                        placeholder="Senha do colaborador"
                        value={senhaRequerente}
                        onChange={(e) => setSenhaRequerente(e.target.value)}
                      />
                      <div className="flex space-x-2 mt-3">
                        <Button
                          type="button"
                          onClick={() => confirmarRetirada(pedido)}
                          disabled={loading}
                        >
                          {loading ? "Confirmando..." : "Confirmar Retirada"}
                        </Button>
                        <Button
                          type="button"
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => setPedidoSelecionado(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex space-x-2">
                      <Button
                        type="button"
                        onClick={() => setPedidoSelecionado(pedido)}
                      >
                        Aprovar
                      </Button>
                      <Button
                        type="button"
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => negarPedido(pedido.id)}
                      >
                        Negar
                      </Button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
