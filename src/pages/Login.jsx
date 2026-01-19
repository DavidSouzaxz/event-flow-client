import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post(`/login`, {
        email,
        password,
      });

      if (res.status === 200) {
        login(res.data.user, res.data.token);
        setLoading(false);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white shadow-xl rounded-2xl w-96 border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-indigo-600 text-center">
          EventFlow
        </h2>
        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Sua senha"
          className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-300 flex items-center justify-center hover:cursor-pointer">
          {loading ? (
            <Loader2 className="animate-spin text-white" size={25} />
          ) : (
            "Entrar"
          )}
        </button>
      </form>
    </div>
  );
}
