import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Trash2,
  Users,
  Edit,
  TrendingUp,
  MapPin,
  Plus,
  Loader2,
  Calendar,
  Ticket,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { PageTransition } from "../components/PageTransition";

export function Dashboard() {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    api
      .get(`/my-events`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMyEvents(res.data))
      .catch((err) => error(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Excluir este evento? Ingressos vendidos serão perdidos.")
    ) {
      try {
        await api.delete(`/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchEvents();
      } catch (err) {
        toast.error("Erro ao excluir.");
      }
    }
  };

  const totalSold = myEvents.reduce(
    (acc, curr) => acc + (curr._count?.tickets || 0),
    0,
  );

  const chartData = myEvents
    .reduce((acc, event) => {
      // Percorre os tickets de cada evento retornado
      (event.tickets || []).forEach((ticket) => {
        const date = new Date(ticket.createdAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });

        const existingDate = acc.find((item) => item.date === date);

        if (existingDate) {
          // Se o dia já existe (ex: 19/01), soma mais uma venda
          existingDate.vendas += 1;
        } else {
          // Se é um dia novo (ex: 18/01), cria a entrada no array
          acc.push({ date, vendas: 1 });
        }
      });
      return acc;
    }, [])
    .sort((a, b) => {
      // Ordenação correta para garantir que 18/01 venha antes de 19/01
      const [dayA, monthA] = a.date.split("/").map(Number);
      const [dayB, monthB] = b.date.split("/").map(Number);
      return (
        new Date(2026, monthA - 1, dayA) - new Date(2026, monthB - 1, dayB)
      );
    });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-gray-500 font-medium italic">A carregar painel...</p>
      </div>
    );

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 mb-6 hover:cursor-pointer transition-all font-bold uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <div className="flex flex-col md:flex-row justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
              Painel do Organizador
            </h1>

            <p className="text-gray-500 font-medium">
              Gerencie suas produções e acompanhe as vendas.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              to="/create-event"
              className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              <Plus size={20} /> NOVO EVENTO
            </Link>
            <Link
              to="/coupons-manager"
              className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              <Ticket size={20} /> GERAR CUPOM
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm mb-12">
          <div className="mb-8">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
              Desempenho de Vendas
            </h2>
            <p className="text-sm text-gray-400 font-medium">
              Volume de ingressos emitidos por dia
            </p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#4f46e5", fontWeight: "bold" }}
                />
                <Line
                  type="monotone"
                  dataKey="vendas"
                  stroke="#4f46e5"
                  strokeWidth={4}
                  dot={{
                    r: 6,
                    fill: "#4f46e5",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STATS */}
        <div className="md:flex md:w-5/10 grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="md:w-5/10 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="md:text-[12px] text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              Eventos
            </p>
            <p className="md:text-4xl text-2xl font-black text-gray-900">
              {myEvents.length}
            </p>
          </div>
          <div className="md:w-5/10 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="md:text-[12px] text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              Vendas
            </p>
            <p className="md:text-4xl text-2xl font-black text-emerald-500">
              {totalSold}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:hidden">
          {myEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-gray-900 uppercase text-sm">
                    {event.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <MapPin size={10} /> {event.location}
                  </p>
                </div>
                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-black text-[10px]">
                  {event._count?.tickets || 0} VENDAS
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <p className="text-xs font-bold text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/edit-event/${event.id}`}
                    className="p-3 bg-gray-50 text-indigo-600 rounded-xl"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-3 bg-gray-50 text-red-500 rounded-xl hover:cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE (Apenas visível em telas médias/grandes) */}
        <div className="hidden md:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-6 text-xs font-black uppercase text-gray-400">
                  Evento
                </th>
                <th className="px-8 py-6 text-xs font-black uppercase text-gray-400">
                  Data
                </th>
                <th className="px-8 py-6 text-xs font-black uppercase text-gray-400">
                  Vendas
                </th>
                <th className="px-8 py-6 text-xs font-black uppercase text-gray-400 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50/50">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900 uppercase text-sm">
                      {event.title}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-600">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-black text-xs">
                      {event._count?.tickets || 0} INSCRITOS
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/edit-event/${event.id}`}
                        className="text-gray-300 hover:text-indigo-600 hover:cursor-pointer"
                      >
                        <Edit size={20} />
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-gray-300 hover:text-red-500 hover:cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {myEvents.length === 0 && !loading && (
          <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
            Sem eventos.
          </div>
        )}
      </div>
    </PageTransition>
  );
}
