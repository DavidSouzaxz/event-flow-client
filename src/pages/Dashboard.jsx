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
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export function Dashboard() {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    api
      .get(`/my-events`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMyEvents(res.data))
      .catch((err) => console.error(err))
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
        alert("Erro ao excluir.");
      }
    }
  };

  const totalSold = myEvents.reduce(
    (acc, curr) => acc + (curr._count?.tickets || 0),
    0,
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-gray-500 font-medium italic">A carregar painel...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
            Painel do Organizador
          </h1>

          <p className="text-gray-500 font-medium">
            Gerencie suas produções e acompanhe as vendas.
          </p>
        </div>
        <Link
          to="/create-event"
          className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
        >
          <Plus size={20} /> NOVO EVENTO
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            Eventos
          </p>
          <p className="text-2xl font-black text-gray-900">{myEvents.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            Vendas
          </p>
          <p className="text-2xl font-black text-emerald-500">{totalSold}</p>
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
                  className="p-3 bg-gray-50 text-red-500 rounded-xl"
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
                      className="text-gray-300 hover:text-indigo-600"
                    >
                      <Edit size={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-gray-300 hover:text-red-500"
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
  );
}
