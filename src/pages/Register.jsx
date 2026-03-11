import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { PageTransition } from "../components/PageTransition";

export function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await api.post(`/register`, formData);
      toast.success(`Bem-vindo, ${response.data.name}! Conta criada.`);
      navigate("/send-verify-email", { state: { email: formData.email } });
    } catch (err) {
      toast.error("Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-white shadow-xl rounded-2xl w-96 dark:bg-gray-800"
        >
          <h2 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-gray-300 text-center">
            Criar Conta
          </h2>
          <input
            className="w-full p-3 mb-4 border rounded-lg text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            placeholder="Nome"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            className="w-full p-3 mb-4 border rounded-lg text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            placeholder="E-mail"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            className="w-full p-3 mb-6 border rounded-lg text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            type="password"
            placeholder="Senha"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-300 flex items-center justify-center hover:cursor-pointer">
            {loading ? (
              <Loader2 className="animate-spin text-white" size={25} />
            ) : (
              "Cadastrar"
            )}
          </button>
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/login"
              className="block text-sm text-gray-500 cursor-default"
            >
              Já tem uma conta?{" "}
              <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                Login
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
