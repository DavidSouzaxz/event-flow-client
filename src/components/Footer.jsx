import { Calendar, Instagram, Github, Linkedin } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export function Footer() {
  const [signedOut, setSignedOut] = useState(true);
  const { token, signed } = useAuth();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Coluna 1: Branding */}
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-black text-indigo-600 flex items-center gap-2 tracking-tighter mb-4 "
            >
              <Calendar size={28} strokeWidth={3} />
              <span>EventFlow</span>
            </Link>
            <p className="text-gray-500 font-medium max-w-sm">
              A plataforma definitiva para criar, gerenciar e vender ingressos
              para os seus eventos com segurança e facilidade.
            </p>
          </div>

          {/* Coluna 2: Atalhos */}
          <div>
            <h4 className="text-sm font-black uppercase dark:text-gray-300 text-gray-900 tracking-widest mb-6">
              Navegação
            </h4>
            <ul className="space-y-4 text-gray-500 font-bold text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-600 transition">
                  Explorar Eventos
                </Link>
              </li>
              <li>
                <Link
                  to="/my-tickets"
                  className="hover:text-indigo-600 transition"
                >
                  Meus Ingressos
                </Link>
              </li>
              {!signed && (
                <li>
                  <Link
                    to="/login"
                    className="hover:text-indigo-600 transition"
                  >
                    Entrar
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Coluna 3: Redes Sociais */}
          <div>
            <h4 className="text-sm font-black uppercase text-gray-900 dark:text-gray-300 tracking-widest mb-6">
              Social
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/davidsouza-coder/"
                className="p-3 bg-gray-50 rounded-xl text-gray-400 dark:hover:text-indigo-600 dark:bg-indigo-600 hover:text-indigo-600 transition dark:hover:bg-gray-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.github.com/Davidsouzaxz/"
                className="p-3 bg-gray-50 rounded-xl text-gray-400 dark:hover:text-gray-600 dark:bg-indigo-600 hover:text-gray-900 transition dark:hover:bg-gray-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="md:text-justify border-t border-gray-100 dark:border-gray-700 pt-8 flex text-center flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            © 2026 EventFlow. Todos os direitos reservados.
          </p>
          <p className="text-[10px] text-gray-300 font-black uppercase">
            Desenvolvido com ☕ por David Souza
          </p>
        </div>
      </div>
    </footer>
  );
}
