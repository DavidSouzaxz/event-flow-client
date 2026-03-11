import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Mail, Eye, EyeClosed, KeyRound } from "lucide-react";

import api from "../services/api";
import toast from "react-hot-toast";
import { PageTransition } from "../components/PageTransition";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState(true);

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post(`/login`, {
        email,
        password,
      });

      const { user, token } = res.data;

      if (res.status === 200) {
        login(user, token);
        setLoading(false);
        toast.success("Login realizado com sucesso!");
        navigate("/");
      } else {
        toast.error("Erro no login. Verifique suas credenciais.");
      }
    } catch (err) {
      toast.error("Email ou senha incorretos.");
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <form
          onSubmit={handleLogin}
          className="p-8 bg-white shadow-xl rounded-2xl w-96 border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-gray-300 text-center">
            EventFlow <span className="text-indigo-700">Login</span>
          </h2>
          <div className="relative">
            <Mail className="absolute left-3 top-4 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 pl-10 mb-4 border rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <KeyRound
              className="absolute left-3 top-4 text-gray-400"
              size={20}
            />
            <input
              type={visibility ? "password" : "text"}
              placeholder="Senha"
              className="w-full p-3 pl-10 mb-6 border rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="cursor-pointer"
              onClick={toggleVisibility}
              type="button"
            >
              {!visibility && (
                <Eye
                  className="absolute right-3 top-4 text-gray-400 hover:text-indigo-700"
                  size={20}
                />
              )}
              {visibility && (
                <EyeClosed
                  className="absolute right-3 top-4 text-gray-400 hover:text-indigo-700"
                  size={20}
                />
              )}
            </button>
          </div>
          <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-300 flex items-center justify-center hover:cursor-pointer">
            {loading ? (
              <Loader2 className="animate-spin text-white" size={25} />
            ) : (
              "Entrar"
            )}
          </button>

          <div className="mt-6 text-center space-y-2">
            <Link
              to="/register"
              className="block text-sm text-gray-500 cursor-default"
            >
              Não tem uma conta?{" "}
              <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                Registre-se
              </span>
            </Link>
            <Link
              to="/send-verify-email"
              className="block text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reenviar e-mail de verificação
            </Link>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
