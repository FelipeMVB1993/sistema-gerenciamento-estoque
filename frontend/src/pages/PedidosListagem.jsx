import { useEffect, useState } from "react";
import Title from "../components/Title";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";

export default function PedidosListagem() {
  const { token, user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch("http://localhost:3001/pedidos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status) {
          setPedidos(data.pedidos);
        } else {
          setMensagem("Erro ao carregar pedidos.");
        }
      } catch (error) {
        setMensagem(`Falha ao conectar ao servidor ${error}`);
      }
    };

    fetchPedidos();
  }, [token]);

  const toggleDetalhes = (id) => {
    setPedidoAberto((prev) => (prev === id ? null : id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "aprovado":
        return "bg-green-100 text-green-700 border-green-400";
      case "negado":
        return "bg-red-100 text-red-700 border-red-400";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-400";
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-slate-100 overflow-auto">
        <Title>
          {user?.perfil === "colaborador"
            ? "Meus Pedidos"
            : "Lista de Pedidos do Sistema"}
        </Title>

        {mensagem && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
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
              <motion.div
                key={pedido.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`bg-white p-4 rounded-lg shadow border-l-4 ${
                  pedido.status === "aprovado"
                    ? "border-green-400"
                    : pedido.status === "negado"
                    ? "border-red-400"
                    : "border-yellow-400"
                }`}
              >
                {/* Cabeçalho do pedido */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-700">
                      Pedido #{pedido.id}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Feito por:{" "}
                      <span className="font-medium text-slate-700">
                        {pedido.requerente?.nome}
                      </span>{" "}
                      ({pedido.requerente?.username})
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(pedido.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                      pedido.status
                    )}`}
                  >
                    {pedido.status.toUpperCase()}
                  </span>
                </div>

                {/* Botão de detalhes */}
                <div className="mt-4">
                  <Button
                    onClick={() => toggleDetalhes(pedido.id)}
                    className="bg-slate-500 hover:bg-slate-600"
                  >
                    {pedidoAberto === pedido.id
                      ? "Ocultar Detalhes"
                      : "Ver Detalhes"}
                  </Button>
                </div>

                {/* Detalhes do pedido */}
                <AnimatePresence>
                  {pedidoAberto === pedido.id && (
                    <motion.div
                      key="detalhes"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 bg-slate-50 rounded-md p-4 border border-slate-200"
                    >
                      <p className="text-slate-600 text-sm mb-2">
                        <b>Observação:</b>{" "}
                        {pedido.observacao || "Sem observações."}
                      </p>

                      <h3 className="font-semibold text-slate-700 mb-2">
                        Itens Solicitados:
                      </h3>
                      <ul className="pl-5 list-disc text-sm text-slate-600">
                        {pedido.itens.map((item) => (
                          <li key={item.id}>
                            {item.material?.nome} — {item.quantidade}{" "}
                            {item.material?.unidade}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
