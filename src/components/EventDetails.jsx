import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import api from "../services/api";
import toast from "react-hot-toast";
import { PageTransition } from "./PageTransition";

export function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, signed } = useAuth();
  const [event, setEvent] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [cupomInvalid, setCupomInvalid] = useState(false);
  const [validatingCupom, setValidatingCupom] = useState(false);
  const [ticketsIsPresent, setTicketsIsPresent] = useState(false);

  const handleApplyDiscount = async () => {
    setLoading(true);
    if (discountApplied || !discountCode.trim()) return;

    setValidatingCupom(true);
    setCupomInvalid(false);

    try {
      const res = await api.post("/coupons/validate", { code: discountCode });

      setDiscountPercent(res.data.discountPercent);
      setDiscountApplied(true);
      toast.success(res.data.message);
      setLoading(false);
    } catch (err) {
      setCupomInvalid(true);
      setDiscountPercent(0);
      setDiscountApplied(false);
      setLoading(false);
    } finally {
      setValidatingCupom(false);
    }
  };

  const removeDiscount = () => {
    setDiscountPercent(0);
    setDiscountApplied(false);
    setDiscountCode("");
    setCupomInvalid(false);
  };

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => setEvent(res.data));
  }, [id]);

  useEffect(() => {
    if (!token) {
      setTicketsIsPresent(false);
      return;
    }

    api
      .get(`/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const hasTicket = res.data.some(
          (ticket) =>
            ticket.eventId === id || (ticket.event && ticket.event.id === id),
        );
        setTicketsIsPresent(hasTicket);
      })
      .catch((err) => {
        console.error("Erro ao verificar ingressos:", err);
      });
  }, [token, id]);

  const subtotal = event ? event.price * selectedTickets : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const totalWithDiscount = subtotal - discountAmount;

  const handleBooking = async () => {
    setLoading(true);
    if (!signed) return navigate("/login");

    if (selectedTickets > event.capacity) {
      return toast.error(
        "Quantidade selecionada maior que ingressos disponíveis.",
      );
    }

    try {
      await api.post(
        `/bookings`,
        {
          eventId: id,
          quantity: selectedTickets,
          couponCode: discountApplied ? discountCode : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Verfique sua caixa de emails e confirme sua reserva!");
      toast.success("Ingressos garantidos! Veja na aba 'Meus Ingressos'.");
      navigate("/my-tickets");
    } catch (err) {
      toast.error("Erro ao reservar ingresso.");
    } finally {
      setLoading(false);
    }
  };

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  if (!event)
    return (
      <div className="flex justify-center items-center gap-2 p-20 text-center animate-pulse">
        Carregando...
        <Loader2 className="animate-spin text-indigo-600" size={25} />
      </div>
    );

  const isSoldOut = event.capacity <= 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors hover:cursor-pointer font-bold uppercase text-xs tracking-widest"
      >
        <ChevronLeft size={20} /> Voltar para eventos
      </button>
      <PageTransition>
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
              {!ticketsIsPresent ? (
                <div>
                  <div className="space-y-4 pt-6 border-t border-gray-50">
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Preço unitário</span>
                      <span className="text-2xl font-black text-indigo-600">
                        {event.price === 0
                          ? "Gratuito"
                          : currencyFormatter.format(event.price)}
                      </span>
                    </div>
                  </div>
                  {!isSoldOut && (
                    <div className="flex items-center gap-4 mt-6 text-sm text-gray-500 font-medium">
                      <div>
                        <select
                          value={selectedTickets}
                          onChange={(e) =>
                            setSelectedTickets(Number(e.target.value))
                          }
                          className="w-24 bg-gray-50 p-2 rounded-xl font-bold text-gray-900"
                        >
                          {Array.from(
                            {
                              length: Math.min(
                                event.ticketLimitPerPerson,
                                event.capacity || 1,
                              ),
                            },
                            (_, i) => i + 1,
                          ).map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                        <div className="text-xs text-gray-400 mt-1">
                          Selecionado: {selectedTickets}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Ingressos restantes - {event.capacity}</span>
                      </div>
                    </div>
                  )}
                  {isSoldOut && (
                    <div className="flex items-center gap-4 mt-6 text-sm text-gray-500 font-medium">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Esgotado</span>
                      </div>
                    </div>
                  )}

                  {!isSoldOut && (
                    <div className="w-full mt-6 pt-6 border-t border-gray-50 flex flex-col   text-gray-900 font-medium text-lg">
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-light">
                          {selectedTickets} Ticket
                          {selectedTickets > 1 ? "s" : ""} x{" "}
                          {currencyFormatter.format(event.price)}
                        </p>
                        {discountApplied && (
                          <p className="text-sm font-light text-green-600">
                            Desconto {discountPercent}% aplicado (-
                            {currencyFormatter.format(discountAmount)})
                          </p>
                        )}
                      </div>

                      <div className="gap-2 flex justify-end">
                        <span>Total: </span>
                        <span className="text-1xl text-green-600">
                          {event.price === 0
                            ? "Gratuito"
                            : currencyFormatter.format(totalWithDiscount)}
                        </span>
                      </div>
                      {!isSoldOut && (
                        <div className="w-full flex justify-between items-center">
                          <input
                            type="text"
                            placeholder="CUPOM"
                            className={`w-40 p-3 bg-gray-50 rounded-xl outline-none border-2 transition-all ${
                              cupomInvalid
                                ? "border-red-200 focus:border-red-400"
                                : "border-transparent focus:border-indigo-500"
                            } font-bold uppercase text-sm`}
                            value={discountCode}
                            onChange={(e) =>
                              setDiscountCode(e.target.value.toUpperCase())
                            }
                            disabled={discountApplied || validatingCupom}
                          />
                          <button
                            type="button"
                            onClick={
                              discountApplied
                                ? removeDiscount
                                : handleApplyDiscount
                            }
                            disabled={validatingCupom}
                            className={`p-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:cursor-pointer ${
                              discountApplied
                                ? "bg-red-50 text-red-500 hover:bg-red-100"
                                : "bg-gray-900 text-white hover:bg-indigo-600"
                            }`}
                          >
                            {validatingCupom ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : discountApplied ? (
                              "Remover"
                            ) : (
                              "Aplicar"
                            )}
                          </button>
                        </div>
                      )}
                      {cupomInvalid && !isSoldOut && (
                        <span className="text-[10px] mt-2 ml-2 text-red-500 font-black uppercase tracking-tighter">
                          Cupom inexistente ou expirado
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleBooking}
                    className="w-full mt-8 bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 transition-all shadow-xl shadow-indigo-100 hover:cursor-pointer"
                    disabled={isSoldOut || loading}
                  >
                    {isSoldOut ? (
                      "Esgotado"
                    ) : loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Reservar"
                    )}
                  </button>
                </div>
              ) : (
                <div className="py-10 text-center border-t border-gray-50 mt-6">
                  <p className="text-gray-500 font-medium">
                    Já possui reserva para este evento.
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                <ShieldCheck size={14} /> Pagamento 100% seguro via EventFlow
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
