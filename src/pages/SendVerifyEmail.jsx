import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Loader2, MailCheck, ArrowRight, Mail } from "lucide-react";
import { PageTransition } from "../components/PageTransition";

export function SendVerifyEmail() {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(location.state?.email || "");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendEmail = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!userEmail) {
      setError("Por favor, informe seu e-mail.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/send-verify-email", { email: userEmail });
      setSuccess(true);
      setTimer(60);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erro ao enviar e-mail de verificação.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl shadow-indigo-100 border border-gray-50 text-center dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-800">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4 dark:text-gray-50">
            Verifique seu E-mail
          </h2>
          <p className="text-gray-500 mb-8">
            {location.state?.email
              ? "Clique no botão abaixo para receber um link de verificação no seu e-mail cadastrado."
              : "Informe seu e-mail abaixo para receber um link de verificação."}
          </p>

          {!location.state?.email && !success && (
            <div className="mb-6 relative">
              <Mail className="absolute left-3 top-4 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Seu e-mail cadastrado"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 dark:border-gray-600 focus:ring-indigo-500 text-gray-700 dark:text-gray-100"
              />
            </div>
          )}

          {success && (
            <div className="flex flex-col items-center animate-in zoom-in duration-300 mb-6">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <MailCheck className="w-10 h-10 text-green-600" />
              </div>
              <span className="text-green-700 font-bold">
                E-mail enviado com sucesso!
              </span>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center animate-in zoom-in duration-300 mb-6">
              <span className="text-red-600 font-bold">{error}</span>
            </div>
          )}

          <button
            onClick={handleSendEmail}
            disabled={loading || timer > 0}
            className={`w-full py-4 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 transition-all hover:cursor-pointer shadow-lg ${
              loading || timer > 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : timer > 0 ? (
              `Aguarde ${timer}s para reenviar`
            ) : (
              <>
                Enviar E-mail de Verificação <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="mt-8">
            <button
              type="button"
              className="text-indigo-600 hover:underline font-bold"
              onClick={() => navigate(-1)}
            >
              Voltar para o Login
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
