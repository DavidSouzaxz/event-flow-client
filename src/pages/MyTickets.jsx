import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Ticket, MapPin, Calendar, Loader2, ArrowLeft } from "lucide-react"; // Adicionado Loader2
import api from "../services/api";
import { PageTransition } from "../components/PageTransition";
import { useNavigate } from "react-router-dom";

export function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("@EventFlow:token");
    api
      .get(`/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTickets(res.data);
      })
      .catch((err) => error(err))
      .finally(() => setLoading(false));
  }, []);

  // Spinner de carregamento
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600 mb-2" size={40} />
        <p className="text-gray-500 font-medium italic">
          A carregar ingressos...
        </p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto p-4 md:p-6 mb-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 mb-6 hover:cursor-pointer transition-all font-bold uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <h1 className="text-3xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
          <Ticket className="text-indigo-600" size={32} /> Meus Ingressos
        </h1>
        {tickets.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl py-16 px-6 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-bold">
              Ainda não compraste nenhum ingresso.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white border rounded-[2rem] p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* QR Code centralizado no mobile */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shrink-0">
                  <QRCodeSVG value={`ticket-auth:${ticket.id}`} size={130} />
                </div>

                {/* Informações do Evento - Texto alinhado ao centro no mobile */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                    {ticket.event.title}
                  </h3>

                  <div className="mt-3 space-y-2 text-gray-500 text-sm font-medium">
                    <p className="flex items-center justify-center md:justify-start gap-2">
                      <Calendar size={16} className="text-indigo-500" />
                      {new Date(ticket.event.date).toLocaleDateString("pt-PT", {
                        dateStyle: "long",
                      })}
                    </p>
                    <p className="flex items-center justify-center md:justify-start gap-2">
                      <MapPin size={16} className="text-indigo-500" />
                      {ticket.event.location}
                    </p>
                  </div>

                  {/* Badge de quantidade mais visível para Mobile */}
                  <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-2">
                    <div className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
                      {ticket.quantity}{" "}
                      {ticket.quantity > 1 ? "Entradas" : "Entrada"}
                    </div>
                    <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
                      Confirmado
                    </div>
                  </div>
                </div>

                {/* ID do Ingresso para referência */}
                <div className="w-full md:w-auto border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 text-center md:text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                    Código da Reserva
                  </p>
                  <p className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 md:bg-transparent py-2 rounded-lg mt-1">
                    #{ticket.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
