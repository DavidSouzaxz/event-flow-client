import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Save, ArrowLeft } from "lucide-react";
import api from "../services/api";

export function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => {
      const date = new Date(res.data.date).toISOString().slice(0, 16);
      setFormData({ ...res.data, date });
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Evento atualizado!");
      navigate("/dashboard");
    } catch (err) {
      alert("Erro ao atualizar.");
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
        Editar Evento
      </h1>

      <form
        onSubmit={handleUpdate}
        className="space-y-6 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100"
      >
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Título do Evento
          </label>
          <input
            value={formData.title}
            className="w-full p-5 bg-gray-50 rounded-2xl border-black outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900"
            placeholder="Título do Evento"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Data
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900"
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
                value={formData.price}
                className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900"
                placeholder="Preço (R$)"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          </div>

          <label className="block text-sm font-bold text-gray-700 mb-2">
            URL da Imagem
          </label>
          <input
            value={formData.imageUrl}
            className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-500 text-sm"
            placeholder="URL da Imagem"
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />

          <label className="block text-sm font-bold text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description}
            rows="4"
            className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-600"
            placeholder="Descrição detalhada..."
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <button className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-gray-900 hover:cursor-pointer transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
          <Save size={24} /> SALVAR ALTERAÇÕES
        </button>
      </form>
    </div>
  );
}
