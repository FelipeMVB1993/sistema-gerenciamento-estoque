import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function AtualizarUsuario() {
  const { token, user } = useAuth(); // pega dados do usuário logado
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Busca os dados do usuário logado
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch(`http://localhost:3001/usuarios/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!data.status) throw new Error("Erro ao carregar os dados");

        setNome(data.usuario.nome);
        setUsername(data.usuario.username);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsuario();
  }, [token, user.id]);

  // 🔹 Atualizar cadastro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setLoading(true);

    try {
      const body = {
        nome,
        username,
        ...(senha.trim() !== "" && { senha }), // ✅ só adiciona se tiver preenchido
      };

      const res = await fetch(`http://localhost:3001/usuarios/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.status)
        throw new Error(data.errors?.[0] || "Erro ao atualizar");

      setMensagem("✅ Dados atualizados com sucesso!");
      setNome(""); //
      setUsername(""); //
      setSenha(""); //
    } catch (error) {
      setMensagem(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-slate-100 flex flex-col items-center overflow-auto">
        <div className="bg-white p-6 rounded-md shadow w-full max-w-md mt-8">
          <Title>Atualizar Cadastro</Title>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 mt-4"
          >
            <Input
              type="text"
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled
            />

            <Input
              type="text"
              placeholder="Digite o usuário (login)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Digite uma nova senha (opcional)"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar Cadastro"}
            </Button>

            {mensagem && (
              <div
                className={`p-3 rounded text-sm text-center ${
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
