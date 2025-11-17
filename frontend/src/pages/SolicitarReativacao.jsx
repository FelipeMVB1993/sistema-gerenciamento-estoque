import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Title from "../components/Title";

export default function SolicitarReativacao() {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  // Se o username veio da tela de login, já preenche automaticamente
  useEffect(() => {
    if (location.state?.username) {
      setUsername(location.state.username);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    if (!username.trim()) {
      setMensagem("⚠️ Informe o nome de usuário para continuar.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/usuarios/solicitar-reativacao",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(
          data.errors?.join(", ") || "Erro ao enviar solicitação."
        );
      }

      setMensagem(
        "✅ Solicitação enviada com sucesso! Aguarde a liberação do administrador."
      );

      // Redireciona para login após alguns segundos
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    } catch (error) {
      setMensagem(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-500 flex items-center justify-center">
      <div className="space-y-4 p-6 w-[400px] bg-slate-200 rounded-md shadow flex flex-col">
        <Title>Solicitar Reativação</Title>

        <p className="text-sm text-slate-600 text-center">
          Seu usuário está inativo. Envie uma solicitação para o administrador
          reativá-lo.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-2">
          <Input
            type="text"
            placeholder="Digite seu nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
                <span>Enviando...</span>
              </>
            ) : (
              "Enviar Solicitação"
            )}
          </Button>
        </form>

        {mensagem && (
          <div
            className={`p-3 rounded text-sm text-center border ${
              mensagem.includes("✅")
                ? "bg-green-100 text-green-700 border-green-300"
                : mensagem.includes("⚠️")
                ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {mensagem}
          </div>
        )}

        <button
          onClick={() => navigate("/", { replace: true })}
          className="text-sm text-slate-600 underline hover:text-slate-800 mt-2"
        >
          ← Voltar para o login
        </button>
      </div>
    </div>
  );
}
