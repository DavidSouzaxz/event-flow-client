import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapPin, Calendar, Search, ArrowRight, X, Loader2 } from "lucide-react";
import api from "../services/api";

export function Home() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o texto de busca
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [priceLimit, setPriceLimit] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let results = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesPrice = true;
      if (activeFilter === "valor" && priceLimit) {
        matchesPrice = event.price <= parseFloat(priceLimit);
      }

      let matchesDate = true;
      if (activeFilter === "data" && selectedDate) {
        const dateObj = new Date(event.date);

        const eventDateFormatted = dateObj.toISOString().split("T")[0];

        matchesDate = eventDateFormatted === selectedDate;
      }
      return matchesSearch && matchesPrice && matchesDate;
    });

    if (activeFilter === "local") {
      results = [...results].sort((a, b) =>
        a.location.localeCompare(b.location),
      );
    }

    setFilteredEvents(results);
  }, [searchTerm, events, activeFilter, priceLimit, selectedDate]);

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[600px] w-full flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Concert Background"
        />
        <div className="absolute inset-0 bg-black/50 "></div>

        <div className="relative z-10 w-full max-w-4xl px-6 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight uppercase">
            Descubra experiências <br /> inesquecíveis
          </h1>
          <p className="text-gray-200 text-lg mb-8 font-medium">
            Encontre os melhores eventos ao seu redor
          </p>

          <div className="relative max-w-2xl mx-auto mb-6 group">
            <input
              type="text"
              placeholder="Pesquisar por nome ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white w-full py-3 px-8 pr-14 rounded-full text-indigo-600  outline-none shadow-2xl  focus:ring-4 focus:ring-indigo-500/20 transition-all text-lg"
            />
            <Search className="absolute right-6 top-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() =>
                setActiveFilter(activeFilter === "local" ? "todos" : "local")
              }
              className={`${
                activeFilter === "local"
                  ? "bg-indigo-600 scale-105"
                  : "bg-white/10"
              } border border-white/20 backdrop-blur-md px-6 py-2 rounded-full font-bold transition-all hover:bg-white/20`}
            >
              Localização
            </button>
            <button
              onClick={() => {
                setActiveFilter(activeFilter === "data" ? "todos" : "data");
                setSelectedDate("");
              }}
              className={`${
                activeFilter === "data"
                  ? "bg-indigo-600 scale-105"
                  : "bg-white/10"
              } border border-white/20 backdrop-blur-md px-6 py-2 rounded-full font-bold transition-all hover:bg-white/20`}
            >
              Data
            </button>
            <button
              onClick={() => {
                setActiveFilter(activeFilter === "valor" ? "todos" : "valor");
                setPriceLimit("");
              }}
              className={`${
                activeFilter === "valor"
                  ? "bg-indigo-600 scale-105"
                  : "bg-white/10"
              } border border-white/20 backdrop-blur-md px-6 py-2 rounded-full font-bold transition-all hover:bg-white/20`}
            >
              Valor
            </button>
          </div>

          <div className="h-16 flex items-center justify-center">
            {activeFilter === "valor" && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="mr-3 font-bold">Até R$:</label>
                <input
                  type="number"
                  placeholder="Ex: 150"
                  value={priceLimit}
                  onChange={(e) => setPriceLimit(e.target.value)}
                  className="bg-white text-gray-900 px-6 py-2 rounded-xl outline-none w-32 font-bold"
                />
              </div>
            )}

            {activeFilter === "data" && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="mr-3 font-bold">No dia:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white text-gray-900 px-6 py-2 rounded-xl outline-none font-bold"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* GRID DE EVENTOS FILTRADOS */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 font-medium italic">
            Carregando eventos...
          </p>
          <Loader2 className="animate-spin text-gray-400" size={25} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              {searchTerm
                ? `Resultados para: ${searchTerm}`
                : "Próximos Eventos"}
            </h2>
            <span className="text-gray-400 font-bold">
              {filteredEvents.length} eventos encontrados
            </span>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-5 left-5">
                      <span className="bg-white text-gray-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg">
                        {event.price === 0 ? "Grátis" : "Premium"}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                      {event.title}
                    </h3>
                    <div className="flex flex-col gap-2 text-gray-500 text-sm mb-8 font-medium">
                      <p className="flex items-center gap-2">
                        <Calendar size={16} className="text-indigo-600" />{" "}
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="text-indigo-600" />{" "}
                        {event.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <span className="text-2xl font-bold text-gray-900 tracking-tighter">
                        {event.price === 0
                          ? "Grátis"
                          : currencyFormatter.format(event.price)}
                      </span>
                      <Link
                        to={`/event/${event.id}`}
                        className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg active:scale-90"
                      >
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="text-xl text-gray-400 font-bold">
                Nenhum evento encontrado.
              </p>
            </div>
          )}
        </div>
      )}
      {/* <div className="flex flex-col items-center justify-center gap-3 text-center py-10 text-gray-400 font-bold">
        <p>Todos os direitos Reservados para DavidSouzaxz © 2026</p>
        <div className="flex gap-5">
          <a
            href="https://www.linkedin.com/in/davidsouza-coder"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-indigo-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" />
            </svg>
          </a>
          <a
            href="https://github.com/davidsouzaxz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-indigo-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
      </div> */}
    </div>
  );
}
