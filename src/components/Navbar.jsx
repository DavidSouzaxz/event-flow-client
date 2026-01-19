import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Ticket,
  LogOut,
  Calendar,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout, signed, info } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar o menu mobile
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-black text-indigo-600 flex items-center gap-2 tracking-tighter"
          >
            <Calendar size={28} strokeWidth={3} />
            <span>EventFlow</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            {signed ? (
              <>
                <Link
                  to="/my-tickets"
                  className="text-gray-600 hover:text-indigo-600 flex items-center gap-1 font-bold text-sm transition"
                >
                  <Ticket size={18} /> Meus Ingressos
                </Link>
                {info?.role === "ADMIN" && (
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-indigo-600 flex items-center gap-1 font-bold text-sm transition"
                  >
                    <LayoutDashboard size={18} /> Painel
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <span className="text-sm font-bold text-gray-800">
                    Olá, {user?.name.split(" ")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 font-bold text-sm">
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 p-2 outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER (O que aparece ao clicar no hambúrguer) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-300">
          {signed ? (
            <>
              <div className="py-3 border-b border-gray-50 mb-2">
                <p className="text-xs text-gray-400 uppercase font-black">
                  Utilizador
                </p>
                <p className="text-gray-900 font-bold">{user?.name}</p>
              </div>
              <Link
                to="/my-tickets"
                onClick={toggleMenu}
                className="flex items-center gap-3 p-3 text-gray-600 font-bold hover:bg-indigo-50 rounded-xl"
              >
                <Ticket size={20} className="text-indigo-600" /> Meus Ingressos
              </Link>
              {info?.role === "ADMIN" && (
                <Link
                  to="/dashboard"
                  onClick={toggleMenu}
                  className="flex items-center gap-3 p-3 text-gray-600 font-bold hover:bg-indigo-50 rounded-xl"
                >
                  <LayoutDashboard size={20} className="text-indigo-600" />{" "}
                  Painel de Controle
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="w-full flex items-center gap-3 p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl mt-4"
              >
                <LogOut size={20} /> Sair da conta
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="text-center p-3 text-gray-600 font-bold border border-gray-200 rounded-xl"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="text-center p-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md"
              >
                Criar conta gratuita
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
