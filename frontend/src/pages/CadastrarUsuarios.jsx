import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function CadastrarUsuario() {
  const { token } = useAuth();
  const location = useLocation();
  const usuarioEdicao = location.state?.usuario || null;

  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Preenche o formulário se veio usuário da listagem
  useEffect(() => {
    if (usuarioEdicao) {
      setNome(usuarioEdicao.nome);
      setUsername(usuarioEdicao.username);
      setSenha("");
      setPerfil(usuarioEdicao.perfil);
      setAtivo(usuarioEdicao.ativo);
    }
  }, [usuarioEdicao]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setLoading(true);

    try {
      if (!nome || !username || !perfil) {
        throw new Error("Preencha todos os campos obrigatórios!");
      }

      const body = {
        nome,
        username,
        perfil,
        ativo,
      };

      if (senha) body.senha = senha; // só envia se usuário digitou

      const url = usuarioEdicao
        ? `http://localhost:3001/usuarios/${usuarioEdicao.id}`
        : "http://localhost:3001/usuarios";

      const method = usuarioEdicao ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(
          data.errors?.join(", ") ||
            (usuarioEdicao
              ? "Erro ao atualizar usuário."
              : "Erro ao cadastrar usuário.")
        );
      }

      setMensagem(
        usuarioEdicao
          ? "✅ Usuário atualizado com sucesso!"
          : "✅ Usuário cadastrado com sucesso!"
      );

      if (!usuarioEdicao) {
        setNome("");
        setUsername("");
        setSenha("");
        setPerfil("");
        setAtivo(true);
      }
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
          <Title>
            {usuarioEdicao ? "Atualizar Usuário" : "Cadastro de Usuários"}
          </Title>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 mt-4"
          >
            <Input
              type="text"
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <Input
              type="text"
              placeholder="Digite o usuário (login)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={usuarioEdicao} // username fixo ao editar
            />

            <Input
              type="password"
              placeholder="Digite a senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <div>
              <label className="block text-slate-600 text-sm mb-1 font-medium">
                Perfil:
              </label>
              <select
                className="border border-slate-300 rounded-md p-2 w-full"
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
              >
                <option value="">Selecione o perfil</option>
                <option value="almoxarife">Almoxarife</option>
                <option value="colaborador">Colaborador</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 text-sm mb-1 font-medium">
                Status:
              </label>
              <select
                className="border border-slate-300 rounded-md p-2 w-full"
                value={ativo ? "true" : "false"}
                onChange={(e) => setAtivo(e.target.value === "true")}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-md"
            >
              {loading
                ? usuarioEdicao
                  ? "Atualizando..."
                  : "Cadastrando..."
                : usuarioEdicao
                ? "Atualizar Usuário"
                : "Cadastrar"}
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
