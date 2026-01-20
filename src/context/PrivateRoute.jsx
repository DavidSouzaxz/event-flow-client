import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Loader2 } from "lucide-react";

export default function PrivateRoute({ children }) {
  const { signed, loading, user } = useAuth();

  // 1. Loading inicial do sistema
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
        <Loader2 className="ml-2 h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!signed && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/not-found" replace />;
  }

  return children;
}
