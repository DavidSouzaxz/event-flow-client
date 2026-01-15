import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Ticket, LogOut, Calendar } from "lucide-react";

export function Navbar() {
  const { user, logout, signed } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-bold text-indigo-600 flex items-center gap-2"
      >
        <Calendar size={28} />
        <span>EventFlow</span>
      </Link>

      <div className="flex items-center gap-6">
        {signed ? (
          <>
            <Link
              to="/my-tickets"
              className="text-gray-600 hover:text-indigo-600 flex items-center gap-1 font-medium"
            >
              <Ticket size={20} /> Meus Ingressos
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-indigo-600 flex items-center gap-1 font-medium"
            >
              Painel de Controle
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l">
              <span className="text-sm font-semibold text-gray-700">
                Olá, {user?.name}
              </span>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 font-medium">
              Entrar
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              Cadastrar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
