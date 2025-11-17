import Input from "./Input";
import Button from "./Button";
import Title from "./Title";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReativar, setShowReativar] = useState(false); // 👈 novo estado
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setShowReativar(false);

    if (!username || !senha) {
      return setErrorMessage("⚠️ Preencha todos os campos!");
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, senha }),
      });

      const data = await response.json();

      // 🔹 Caso o usuário esteja inativo
      if (data.errors?.[0]?.toLowerCase().includes("inativo")) {
        setErrorMessage("Usuário inativo. Deseja solicitar reativação?");
        setShowReativar(true);
        return;
      }

      if (!response.ok || !data.status || !data.token || !data.usuario) {
        const error =
          data.errors?.join(", ") ||
          "❌ Credenciais inválidas. Tente novamente.";
        throw new Error(error);
      }

      // 🔹 Login bem-sucedido
      login(data.token, data.usuario);

      const perfil = data.usuario.perfil?.toLowerCase();
      if (perfil === "admin") navigate("/admin", { replace: true });
      else if (perfil === "almoxarife")
        navigate("/almoxarife", { replace: true });
      else navigate("/colaborador", { replace: true });
    } catch (error) {
      console.error("Erro no login:", error);
      setErrorMessage(error.message || "Erro inesperado ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Solicitar reativação
  const handleSolicitarReativacao = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:3001/usuarios/solicitacoes-reativacao",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(
          data.errors?.join(", ") || "Erro ao solicitar reativação."
        );
      }

      setSuccessMessage(
        "✅ Solicitação enviada! Aguarde aprovação do administrador."
      );
      setShowReativar(false);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-600 flex items-center justify-center">
      <div className="space-y-4 p-6 w-[400px] bg-slate-200 rounded-md shadow flex flex-col">
        <Title>Bem-vindo</Title>

        <form className="space-y-4 flex flex-col" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Digite o usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Digite a senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Entrando...</span>
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        {/* 🔹 Mensagem de erro */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm text-center">
            {errorMessage}
          </div>
        )}

        {/* 🔹 Botão de solicitar reativação */}
        {showReativar && (
          <Button
            onClick={handleSolicitarReativacao}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white w-full"
          >
            Solicitar Reativação
          </Button>
        )}

        {/* 🔹 Mensagem de sucesso */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm text-center">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
