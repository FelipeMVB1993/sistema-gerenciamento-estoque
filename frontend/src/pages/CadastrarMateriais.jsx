import { useState } from "react";
import Title from "../components/Title";
import Sidebar from "../components/Sidebar";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function CadastroMateriais() {
  const { token } = useAuth();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [unidade, setUnidade] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/materiais", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, descricao, unidade }),
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(
          data.errors?.join(", ") || "Erro ao cadastrar material"
        );
      }

      setMensagem("✅ Material cadastrado com sucesso!");
      setNome("");
      setDescricao("");
      setUnidade("");
    } catch (error) {
      setMensagem(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-slate-100 flex flex-col items-center justify-start overflow-auto">
        <div className="bg-white p-6 rounded-md shadow w-full max-w-md mt-8">
          <Title>Cadastro de Materiais</Title>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <Input
              type="text"
              placeholder="Nome do material"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Descrição (opcional)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Unidade de medida (ex: metro, litro, unidade)"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              required
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          {mensagem && (
            <div
              className={`mt-4 p-3 rounded text-sm ${
                mensagem.includes("✅")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {mensagem}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
