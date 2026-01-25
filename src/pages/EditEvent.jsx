import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Save, ArrowLeft, Loader2, ImagePlus } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { form } from "framer-motion/client";

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
    batches: [],
    ticketLimitPerPerson: "",
    capacity: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([
    { name: "1º Lote", price: "", limit: "" },
  ]);
  const handleAddBatch = () => {
    setBatches([
      ...batches,
      { name: `${batches.length + 1}º Lote`, price: "", limit: "" },
    ]);
  };
  const handleBatchChange = (index, field, value) => {
    const newBatches = [...batches];
    newBatches[index][field] = value;
    setBatches(newBatches);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => {
      const date = new Date(res.data.date).toISOString().slice(0, 16);
      setFormData({ ...res.data, date });
    });
  }, [id]);

  const handleUpdate = async (e) => {
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    e.preventDefault();
    try {
      await api.put(`/events/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Evento atualizado!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Erro ao atualizar.");
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

      <h1 className="text-4xl font-black text-gray-900 dark:text-gray-300 mb-8 uppercase tracking-tighter">
        Editar Evento
      </h1>

      <form
        onSubmit={handleUpdate}
        className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-600"
      >
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Título do Evento
          </label>
          <input
            value={formData.title}
            className="w-full p-4 text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Título do Evento"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <div className="md:grid md:grid-cols-2 gap-7">
            <div className="mb-4 md:mb-0">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Data
              </label>
              <input
                value={formData.date}
                type="datetime-local"
                required
                className="w-full p-4 bg-gray-100 text-gray-600  dark:text-gray-300 dark:bg-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div className="mb-4 md:mb-0">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Capacidade Total
              </label>
              <input
                value={formData.capacity}
                required
                type="number"
                className="w-full p-4 bg-gray-100 text-gray-600 dark:text-gray-300 dark:bg-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            </div>
            <div className="mb-4 md:mb-0">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Preço (R$)
              </label>
              <input
                value={formData.price}
                required
                type="number"
                step="0.01"
                min="0"
                className="w-full p-4 bg-gray-100 text-gray-600 dark:text-gray-300 dark:bg-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="mb-4 md:mb-0">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Limite de Tickets por Pessoa
              </label>
              <input
                value={formData.ticketLimitPerPerson}
                required
                type="number"
                step="1"
                min="0"
                className="w-full p-4 bg-gray-100 text-gray-600 dark:text-gray-300 dark:bg-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
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

          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Imagem de Capa
            </label>
            <div className="relative w-full h-64 bg-gray-50 dark:bg-gray-600 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-500 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer overflow-hidden group">
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
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Configuração de Lotes
            </label>
            {batches.map((batch, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-2 p-4 bg-gray-100 dark:bg-gray-600 rounded-xl"
              >
                <input
                  placeholder="Nome (ex: Promocional)"
                  value={batch.name}
                  onChange={(e) =>
                    handleBatchChange(index, "name", e.target.value)
                  }
                  className="w-full p-4 bg-gray-100 text-gray-600 dark:text-gray-300 dark:border-2 dark:border-gray-500 dark:bg-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Preço"
                  value={batch.price}
                  onChange={(e) =>
                    handleBatchChange(index, "price", e.target.value)
                  }
                  className="w-full p-4 bg-gray-100 text-gray-600 dark:text-gray-300 dark:border-2 dark:border-gray-500 dark:bg-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 "
                />
                <input
                  type="number"
                  placeholder="Qtd Ingressos"
                  value={batch.limit}
                  onChange={(e) =>
                    handleBatchChange(index, "limit", e.target.value)
                  }
                  className="w-full p-4 bg-gray-100 text-gray-600 dark:text-gray-300 dark:border-2 dark:border-gray-500 dark:bg-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddBatch}
              className="text-indigo-600 font-bold text-sm hover:underline dark:text-indigo-400 hover:cursor-pointer transition-all"
            >
              + Adicionar outro lote
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Localização
            </label>
            <input
              required
              className="w-full p-4 bg-gray-100  text-gray-600 dark:text-gray-300 dark:bg-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: São Paulo, SP"
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description}
            rows="4"
            className="w-full p-4 bg-gray-100 text-gray-600 dark:text-gray-300 dark:bg-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Descrição detalhada..."
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 hover:cursor-pointer transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-gray-200 dark:shadow-indigo-400 dark:hover:text-indigo-600 dark:shadow-sm dark:hover:shadow-lg">
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              <Save size={24} /> SALVAR ALTERAÇÕES
            </>
          )}
        </button>
      </form>
    </div>
  );
}
