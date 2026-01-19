import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Ticket,
  Plus,
  Trash2,
  Calendar,
  Tag,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export function CouponManager() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: "",
    expirationDate: "",
    maxUses: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await api.get(`/coupons`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCoupons(res.data);
  };

  const desactiveCoupon = async (couponId) => {
    try {
      await api.delete(`/coupons/${couponId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cupom desativado com sucesso!");
      fetchCoupons();
    } catch (err) {
      toast.error("Erro ao desativar cupom.");
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/coupons`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cupom criado com sucesso!");
      setFormData({
        code: "",
        discountPercent: "",
        expirationDate: "",
        maxUses: "",
      });
      fetchCoupons();
    } catch (err) {
      toast.error("Erro ao criar cupom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors hover:cursor-pointer font-bold uppercase text-xs tracking-widest"
      >
        <ChevronLeft size={20} /> Voltar para painel
      </button>
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-2">
        <Tag className="text-indigo-600" /> Gerador de Cupons
      </h1>

      {/* FORMULÁRIO DE CRIAÇÃO */}
      <form
        onSubmit={handleCreateCoupon}
        className="flex flex-col bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl mb-12 md:grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-gray-400 ml-2">
            Código do Cupom
          </label>
          <input
            type="text"
            placeholder="EX: VERÃO25"
            required
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold uppercase"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value.toUpperCase() })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-gray-400 ml-2">
            Desconto (%)
          </label>
          <input
            type="number"
            placeholder="10"
            min="0"
            required
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold"
            value={formData.discountPercent}
            onChange={(e) =>
              setFormData({ ...formData, discountPercent: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-gray-400 ml-2">
            Data de Expiração
          </label>
          <input
            type="date"
            required
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold"
            value={formData.expirationDate}
            onChange={(e) =>
              setFormData({ ...formData, expirationDate: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-gray-400 ml-2">
            Usos Máximos
          </label>
          <input
            type="number"
            placeholder="100"
            required
            min="0"
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold"
            value={formData.maxUses}
            onChange={(e) =>
              setFormData({ ...formData, maxUses: e.target.value })
            }
          />
        </div>
        <div className="flex col-span-2 justify-end ">
          <button
            disabled={loading}
            className="md:col-span-2 md:mt-2 flex bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-900 transition items-center gap-2 p-4 hover:cursor-pointer mt-5"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Plus size={20} /> Criar Cupom
              </>
            )}
          </button>
        </div>
      </form>

      {/* LISTA DE CUPONS */}
      <div className="grid gap-4">
        <h2 className="text-xl font-black uppercase text-gray-900 ml-2">
          Cupons Ativos
        </h2>
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="font-black text-indigo-600 text-lg uppercase">
                {c.code}
              </p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                {c.discountPercent}% OFF • Válido até{" "}
                {new Date(c.expirationDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">
                {c.usedCount} Usados
              </span>
              <button
                className="ml-4 text-red-500 hover:text-red-700 transition hover:cursor-pointer"
                onClick={desactiveCoupon.bind(this, c.code)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
