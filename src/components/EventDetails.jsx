import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Calendar, MapPin, User, ChevronLeft, ShieldCheck } from "lucide-react";
import api from "../services/api";

export function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, signed } = useAuth();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => setEvent(res.data));
  }, [id]);

  const handleBooking = async () => {
    if (!signed) return navigate("/login");

    try {
      await api.post(
        `/bookings`,
        { eventId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Ingresso garantido! Veja em 'Meus Ingressos'.");
      navigate("/my-tickets");
    } catch (err) {
      alert("Erro ao reservar ingresso.");
    }
  };

  if (!event)
    return <div className="p-20 text-center animate-pulse">Carregando...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors"
      >
        <ChevronLeft size={20} /> Voltar para eventos
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <img
            src={event.imageUrl}
            className="w-full h-[450px] object-cover rounded-[40px] shadow-2xl shadow-indigo-100"
          />

          <div className="mt-10">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">
              {event.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-4">
              <span className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm">
                <Calendar size={18} />{" "}
                {new Date(event.date).toLocaleDateString("pt-BR")}
              </span>
              <span className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-bold text-sm">
                <MapPin size={18} /> {event.location}
              </span>
            </div>

            <div className="mt-10 border-t pt-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Sobre o evento
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 sticky top-28">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                {event.owner.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Organizador
                </p>
                <p className="text-gray-900 font-bold">{event.owner.name}</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex justify-between items-center text-gray-500">
                <span>Preço unitário</span>
                <span className="text-2xl font-black text-indigo-600">
                  R$ {event.price}
                </span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full mt-8 bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all duration-300 transform active:scale-95 shadow-xl shadow-gray-200"
            >
              Reservar Ingresso
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
              <ShieldCheck size={14} /> Pagamento 100% seguro via EventFlow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
