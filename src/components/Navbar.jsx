import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Ticket,
  LogOut,
  Calendar,
  Menu,
  X,
  LayoutDashboard,
  Check,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { UseTheme } from "../hook/UseTheme.jsx";

export function Navbar() {
  const { user, logout, signed } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = UseTheme();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-black text-indigo-600  flex items-center gap-2 tracking-tighter"
          >
            <Calendar size={28} strokeWidth={3} />
            <span>EventFlow</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:cursor-pointer transition-all"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {signed ? (
              <>
                <Link
                  to="/my-tickets"
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 flex items-center gap-1 font-bold text-sm transition"
                >
                  <Ticket size={18} /> Meus Ingressos
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/dashboard"
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 flex items-center gap-1 font-bold text-sm transition"
                  >
                    <LayoutDashboard size={18} /> Painel
                  </Link>
                )}
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin-tickets"
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 flex items-center gap-1 font-bold text-sm transition"
                  >
                    <Check size={18} /> Check-ins
                  </Link>
                )}
                <div className="flex items-center gap-5 pl-4 border-l border-gray-200">
                  <div className="flex hover:cursor-pointer hover:scale-105 transition-transform ">
                    <Link to="/profile" className="flex items-center gap-2 ">
                      <img
                        src={
                          user?.avatarUrl ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`
                        }
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border-2 border-indigo-50 shadow-sm object-cover group-hover:border-indigo-500 transition-all dark:hover:border-indigo-600"
                      />
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-300 dark:hover:text-indigo-600">
                        Olá, {user?.name.split(" ")[0]}
                      </span>
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-500 transition hover:cursor-pointer"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-white font-bold text-sm dark:hover:text-indigo-600"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition dark:hover:bg-gray-200 dark:hover:text-indigo-600 "
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:cursor-pointer transition-all"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
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
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-300 dark:bg-gray-800 dark:border-gray-600">
          {signed ? (
            <>
              <Link
                to="/profile"
                onClick={toggleMenu}
                className="flex items-center gap-4 py-4 border-b border-gray-50 mb-2 hover:bg-gray-50 rounded-xl px-2 transition-colors dark:border-gray-500 dark:hover:bg-gray-700"
              >
                <img
                  src={user?.avatarUrl}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover dark:border-indigo-600"
                />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-black tracking-widest">
                    Meu Perfil
                  </p>
                  <p className="text-gray-900 font-bold text-lg dark:text-gray-300">
                    {user?.name}
                  </p>
                </div>
              </Link>
              {/* <div className="py-3 border-b border-gray-50 mb-2">
                <p className="text-xs text-gray-400 uppercase font-black">
                  Utilizador
                </p>
                <p className="text-gray-900 font-bold">{user?.name}</p>
              </div> */}
              <Link
                to="/my-tickets"
                onClick={toggleMenu}
                className="flex items-center gap-3 p-3 text-gray-600 font-bold hover:bg-indigo-50 rounded-xl dark:text-gray-300 "
              >
                <Ticket size={20} className="text-indigo-600" /> Meus Ingressos
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  to="/dashboard"
                  onClick={toggleMenu}
                  className="flex items-center gap-3 p-3 text-gray-600 font-bold hover:bg-indigo-50 rounded-xl dark:text-gray-300 "
                >
                  <LayoutDashboard size={20} className="text-indigo-600" />{" "}
                  Painel de Controle
                </Link>
              )}
              {user?.role === "ADMIN" && (
                <Link
                  to="/admin-tickets"
                  onClick={toggleMenu}
                  className="flex items-center gap-3 p-3 text-gray-600 font-bold hover:bg-indigo-50 rounded-xl dark:text-gray-300 "
                >
                  <Check size={20} className="text-indigo-600" /> Check-ins
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
                className="text-center p-3 text-gray-600 font-bold border border-gray-200 rounded-xl dark:border-gray-500 dark:text-gray-300"
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
