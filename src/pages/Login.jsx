import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate(); // Adicionando o useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      console.log("Resposta da API:", res.data); // Log para depuração

      if (res.status === 200) {
        // Verifica se o status é 200
        login(res.data.user, res.data.token);
        // alert("Login realizado com sucesso!");
        navigate("/"); // Redireciona para a home
      } else {
        alert("Erro no login. Verifique suas credenciais.");
      }
    } catch (err) {
      console.error("Erro no login:", err); // Log do erro para depuração
      alert("Email ou senha incorretos.");
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
        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-300">
          Entrar
        </button>
      </form>
    </div>
  );
}
