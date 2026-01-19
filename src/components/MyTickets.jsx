import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import QRCode from "react-qr-code";
import { Ticket, Calendar, MapPin, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    api
      .get(`/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [token]);

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-bold text-gray-400">
        A carregar os teus bilhetes...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
          Meus Ingressos
        </h1>
        <Link
          to="/"
          className="text-indigo-600 font-bold flex items-center gap-2 hover:underline"
        >
          <ArrowLeft size={18} /> Explorar mais
        </Link>
      </div>

      <div className="grid gap-10">
        {tickets.length > 0 ? (
          tickets.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-transform hover:scale-[1.01]"
            >
              <div className="p-8 flex-1 border-b md:border-b-0 md:border-r border-dashed border-gray-200 relative bg-white">
                <div className="hidden md:block absolute -right-3 -top-3 w-6 h-6 bg-gray-50 rounded-full border border-gray-100 shadow-inner"></div>
                <div className="hidden md:block absolute -right-3 -bottom-3 w-6 h-6 bg-gray-50 rounded-full border border-gray-100 shadow-inner"></div>

                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest mb-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Ingresso Ativo
                </div>

                <h2 className="text-3xl font-black text-gray-900 leading-[0.9] uppercase mb-6">
                  {t.event.title}
                </h2>

                <div className="space-y-3 text-gray-500 font-medium">
                  <p className="flex items-center gap-2 text-sm">
                    <Calendar size={18} className="text-indigo-500" />
                    {new Date(t.event.date).toLocaleString("pt-PT", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <MapPin size={18} className="text-indigo-500" />
                    {t.event.location}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                      Voucher ID
                    </p>
                    <p className="text-gray-900 font-mono font-bold text-lg">
                      #{t.id.split("-")[0].toUpperCase()}
                    </p>
                  </div>
                  <button className="bg-gray-100 p-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-10 flex flex-col items-center justify-center min-w-[260px] border-l border-gray-50">
                <div className="bg-white p-5 rounded-[2rem] shadow-xl border border-gray-100">
                  <QRCode
                    value={`http://eventflow.com/verify/${t.id}`}
                    size={140}
                    fgColor="#111827"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-400 font-bold">
              Ainda não tens nenhum ingresso.
            </p>
            <Link
              to="/"
              className="text-indigo-600 font-bold underline mt-2 inline-block"
            >
              Bora encontrar um evento!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
