import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Trash2,
  Users,
  Edit,
  TrendingUp,
  Calendar,
  MapPin,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export function Dashboard() {
  const [myEvents, setMyEvents] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    api
      .get(`/my-events`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMyEvents(res.data));
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este evento? Todos os ingressos vendidos serão perdidos."
      )
    ) {
      try {
        await api.delete(`/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchEvents();
      } catch (err) {
        alert("Erro ao excluir evento.");
      }
    }
  };

  const totalSold = myEvents.reduce(
    (acc, curr) => acc + curr._count.tickets,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
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
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-gray-900 transition-all shadow-xl shadow-indigo-100"
        >
          <Plus size={20} /> CRIAR NOVO EVENTO
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <TrendingUp className="text-indigo-600 mb-4" size={32} />
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
            Total de Eventos
          </p>
          <p className="text-4xl font-black text-gray-900">{myEvents.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <Users className="text-emerald-500 mb-4" size={32} />
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
            Ingressos Vendidos
          </p>
          <p className="text-4xl font-black text-gray-900">{totalSold}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
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
              <tr
                key={event.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-8 py-6">
                  <p className="font-bold text-gray-900 uppercase text-sm">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1 font-medium">
                    <MapPin size={12} /> {event.location}
                  </p>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-gray-600">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className="px-8 py-6">
                  <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-black text-xs">
                    {event._count.tickets} INSCRITOS
                  </span>
                </td>
                <td className="flex justify-end items-center px-8 py-6 text-right">
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>

                  <Link
                    to={`/edit-event/${event.id}`}
                    className="text-gray-300 hover:text-indigo-600"
                  >
                    <Edit size={20} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {myEvents.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">
            Você ainda não criou nenhum evento.
          </div>
        )}
      </div>
    </div>
  );
}
