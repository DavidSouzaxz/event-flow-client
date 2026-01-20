import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = localStorage.getItem("@EventFlow:user");
      const storageToken = localStorage.getItem("@EventFlow:token");

      if (storageUser && storageToken) {
        setUser(JSON.parse(storageUser));
        setToken(storageToken);
        api.defaults.headers.Authorization = `Bearer ${storageToken}`;

        try {
          const response = await api.get("/me");
          setUser(response.data);

          localStorage.setItem(
            "@EventFlow:user",
            JSON.stringify(response.data),
          );
        } catch (error) {
          logout();
        }
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const login = (userData, userToken) => {
    api.defaults.headers.Authorization = `Bearer ${userToken}`;

    localStorage.setItem("@EventFlow:token", userToken);
    localStorage.setItem("@EventFlow:user", JSON.stringify(userData));
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem("@EventFlow:token");
    localStorage.removeItem("@EventFlow:user");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        logout,
        loading,
        signed: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
