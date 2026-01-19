import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

function PrivateRoute({ children }) {
  const { signed, user, info } = useAuth();

  if (info === null) {
    return <div>Carregando...</div>;
  }

  if (children.props.path === "/dashboard" || info.role !== "ADMIN") {
    return <Navigate to="/not-found" replace />;
  }

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
