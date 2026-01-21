// pages/AdminTickets.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { PageTransition } from "../components/PageTransition";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();
  const loadTickets = async () => {
    // Busca tickets com status 2 (Pendentes)
    const response = await api.get("/admin/tickets/pendentes");
    setTickets(response.data);
  };

  const handleAction = async (ticketId) => {
    try {
      await api.post(`/tickets/check-in`, { ticketId });

      toast.success("Ação realizada com sucesso!");
      // Remove da lista local após ação
      setTickets(tickets.filter((t) => t.id !== ticketId));
    } catch (err) {
      toast.error("Erro ao processar ação no ticket.");
      alert("Erro ao processar ticket");
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors hover:cursor-pointer font-bold uppercase text-xs tracking-widest"
        >
          <ChevronLeft size={20} /> Voltar
        </button>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-2">
          Controle de Aprovações
        </h1>
        <div className="md:grid flex flex-col gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 gap-4 md:gap-0 rounded-lg flex flex-col md:flex-row md:justify-between items-center shadow-sm"
            >
              <div>
                <p className="text-lg">
                  <span className="font-bold">NOME: </span>
                  {ticket.user.name}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Email: </span>
                  {ticket.user.email}
                </p>
                <p className="text-lg text-gray-500">
                  <span className="font-bold">Evento: </span>
                  {ticket.event.title}
                </p>
              </div>
              <div className="flex md:flex-row gap-2">
                <button
                  onClick={() => handleAction(ticket.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:cursor-pointer hover:scale-105 hover:bg-green-600 transition-transform"
                >
                  Aprovar
                </button>
                <button
                  onClick={() => handleAction(ticket.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:cursor-pointer hover:scale-105 hover:bg-red-600 transition-transform"
                >
                  Recusar
                </button>
              </div>
            </div>
          ))}
          {tickets.length === 0 && <p>Nenhum ticket aguardando aprovação.</p>}
        </div>
      </div>
    </PageTransition>
  );
}
