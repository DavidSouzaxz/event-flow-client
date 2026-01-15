import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { Ticket, MapPin, Calendar } from "lucide-react";

export function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("@EventFlow:token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTickets(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Ticket className="text-indigo-600" /> Meus Ingressos
      </h1>

      {tickets.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          Ainda não compraste nenhum ingresso.
        </p>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white border rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition"
            >
              {/* QR Code com o ID único do ingresso */}
              <div className="bg-gray-50 p-4 rounded-2xl">
                <QRCodeSVG value={`ticket-auth:${ticket.id}`} size={120} />
              </div>

              {/* Informações do Evento */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {ticket.event.title}
                </h3>
                <div className="mt-2 space-y-1 text-gray-500 text-sm">
                  <p className="flex items-center gap-2">
                    <Calendar size={16} />{" "}
                    {new Date(ticket.event.date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} /> {ticket.event.location}
                  </p>
                </div>
                <div className="mt-4 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Pagamento Confirmado
                </div>
              </div>

              {/* ID do Ingresso para referência */}
              <div className="text-right border-l pl-6 hidden md:block">
                <p className="text-xs text-gray-400 uppercase">
                  Código do Ingresso
                </p>
                <p className="font-mono text-sm text-gray-600">
                  #{ticket.id.slice(0, 8)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
