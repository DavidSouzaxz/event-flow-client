import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Save, Loader2, Camera, ArrowLeft } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const { user, setUser } = useAuth(); // Importe o setUser para atualizar o estado global
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Função para lidar com a seleção da imagem
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Cria o preview para o usuário ver antes de salvar
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Criando o FormData (Necessário para enviar arquivos)
    const data = new FormData();
    data.append("name", formData.name);

    if (selectedFile) {
      data.append("avatar", selectedFile); // "avatar" deve ser igual ao upload.single('avatar') do back
    }

    try {
      const res = await api.put("/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Atualiza o contexto e o localStorage com os novos dados (incluindo avatarUrl)
      setUser(res.data);
      localStorage.setItem("@EventFlow:user", JSON.stringify(res.data));

      toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar perfil.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 mb-6 hover:cursor-pointer transition-all font-bold uppercase text-xs tracking-widest"
      >
        <ArrowLeft size={16} /> Voltar ao Painel
      </button>

      <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8 text-center md:text-left">
        Meu Perfil
      </h1>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-10 flex flex-col items-center">
          <div className="relative group">
            <img
              src={
                preview ||
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`
              }
              alt="Avatar"
              className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg object-cover"
            />
            {/* Input de arquivo escondido, acionado pelo botão de câmera */}
            <label className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full border-2 border-white cursor-pointer hover:bg-indigo-500 transition-all">
              <Camera size={16} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <h2 className="mt-4 text-white font-black text-xl uppercase tracking-tight">
            {user?.name}
          </h2>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-2">
              Nome Completo
            </label>
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-300" size={20} />
              <input
                type="text"
                className="w-full pl-12 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-2">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-300" size={20} />
              <input
                type="email"
                disabled
                className="w-full pl-12 p-4 bg-gray-50 rounded-2xl border-none text-gray-400 font-bold cursor-not-allowed"
                value={formData.email}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 hover:cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save size={20} /> Salvar Alterações
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
