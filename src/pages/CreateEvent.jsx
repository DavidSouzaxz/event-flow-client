import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ImagePlus, MapPin, Calendar, DollarSign, Loader2 } from "lucide-react";
import { Save, ArrowLeft } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

export function CreateEvent() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    ticketLimitPerPerson: "",
    capacity: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      await api.post(`/events`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Evento criado com sucesso!");
      navigate("/");
    } catch (err) {
      toast.error(
        "Erro ao criar evento. Verifique se todos os campos estão preenchidos.",
      );
    } finally {
      setLoading(false);
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
              Capacidade Total
            </label>
            <input
              required
              type="number"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: 100"
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Preço (R$)
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Limite de Tickets por Pessoa
            </label>
            <input
              required
              type="number"
              step="1"
              min="0"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: 5"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ticketLimitPerPerson: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Imagem de Capa
          </label>
          <div className="relative w-full h-64 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-all cursor-pointer overflow-hidden group">
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center transition-colors group-hover:text-indigo-500">
                <ImagePlus size={48} />
                <span className="text-sm mt-3 font-bold uppercase tracking-wide">
                  Clique para enviar imagem
                </span>
                <span className="text-xs mt-1 font-medium text-gray-400">
                  Recomendado: 1200x600px
                </span>
              </div>
            )}
            <input
              type="file"
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
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

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 hover:cursor-pointer transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Save size={20} /> Publicar Evento
            </>
          )}
        </button>
      </form>
    </div>
  );
}
