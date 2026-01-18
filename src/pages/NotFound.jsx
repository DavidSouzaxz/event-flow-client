import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        404 - Página Não Encontrada
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Desculpe, a página que você está procurando não existe.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}

export default NotFound;
