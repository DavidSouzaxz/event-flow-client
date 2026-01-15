import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PrivateRoute({ children }) {
  const { signed } = useAuth();

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
