import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ImagePlus, MapPin, Calendar, DollarSign } from "lucide-react";
import { Save, ArrowLeft } from "lucide-react";

export function CreateEvent() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    imageUrl: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/events", formData, {
        headers: { Authorization: `Bearer ${token}` }, // Envia o token para identificar o dono
      });
      alert("Evento criado com sucesso!");
      navigate("/"); // Volta para a home para ver o card novo
    } catch (err) {
      alert(
        "Erro ao criar evento. Verifique se todos os campos estão preenchidos."
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 font-sans">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 mb-6 hover:cursor-pointer transition-all font-bold uppercase text-xs tracking-widest"
      >
        <ArrowLeft size={16} /> Voltar ao Painel
      </button>
      <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter">
        Criar Novo Evento
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-[32px] shadow-xl border border-gray-100"
      >
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Título do Evento
          </label>
          <input
            required
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: Workshop de React"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Data
            </label>
            <input
              type="datetime-local"
              required
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Preço (R$)
            </label>
            <input
              type="number"
              required
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            URL da Imagem de Capa
          </label>
          <input
            required
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://link-da-imagem.com"
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Localização
          </label>
          <input
            required
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: São Paulo, SP"
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            rows="4"
            required
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Detalhes sobre o que vai acontecer..."
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 transition-all shadow-lg shadow-indigo-100">
          Publicar Evento
        </button>
      </form>
    </div>
  );
}
