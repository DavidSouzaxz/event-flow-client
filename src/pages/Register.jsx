import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        formData
      );
      alert(`Bem-vindo, ${response.data.name}! Conta criada.`);
      navigate("/login");
    } catch (err) {
      alert("Erro ao cadastrar. Tente outro e-mail.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-xl rounded-2xl w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-indigo-600">Criar Conta</h2>
        <input
          className="w-full p-3 mb-4 border rounded-lg"
          placeholder="Nome"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          className="w-full p-3 mb-4 border rounded-lg"
          placeholder="E-mail"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          className="w-full p-3 mb-6 border rounded-lg"
          type="password"
          placeholder="Senha"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
