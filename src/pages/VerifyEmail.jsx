import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { PageTransition } from "../components/PageTransition";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const hasCalledApi = useRef(false);
  const token = searchParams.get("token");

  useEffect(() => {
    // Se o token não existe ou se já chamamos a API antes, não faz nada
    if (!token || hasCalledApi.current) return;

    hasCalledApi.current = true; // Marca que a chamada foi feita

    api
      .get(`/verify-email?token=${token}`)
      .then(() => setStatus("success"))
      .catch((err) => {
        // Log para debug
        console.error("Erro na verificação:", err.response?.data);
        setStatus("error");
      });
  }, [token]);

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl shadow-indigo-100 border border-gray-50 text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                Verificando sua conta...
              </h2>
              <p className="text-gray-500 mt-2">
                Estamos validando seu token de acesso.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
              <div className="bg-green-100 p-4 rounded-full mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                E-mail Verificado!
              </h2>
              <p className="text-gray-500 mt-2 mb-8">
                Sua conta foi ativada com sucesso. Você já pode acessar todos os
                eventos.
              </p>
              <Link
                to="/login"
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg"
              >
                Ir para o Login <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
              <div className="bg-red-100 p-4 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                Falha na Verificação
              </h2>
              <p className="text-gray-500 mt-2 mb-8">
                O link de verificação é inválido ou já expirou. Tente se
                registrar novamente.
              </p>
              <Link
                to="/register"
                className="w-full border-2 border-gray-200 text-gray-900 py-4 rounded-2xl font-black uppercase text-sm hover:bg-gray-50 transition-all"
              >
                Voltar para Cadastro
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
