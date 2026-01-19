import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import api from "../services/api";
const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("@EventFlow:token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedUser = localStorage.getItem("@EventFlow:user");
    if (storagedUser && token) {
      setUser(JSON.parse(storagedUser));
    }
  }, [token]);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = localStorage.getItem("@EventFlow:user");
      const storageToken = localStorage.getItem("@EventFlow:token");

      if (storageUser && storageToken) {
        // IMPORTANTE: Insira o token no cabeçalho manualmente para esta primeira validação
        api.defaults.headers.Authorization = `Bearer ${storageToken}`;

        try {
          const response = await api.get("/me");

          // Se a API confirmou, mantemos os dados
          setUser(response.data);
          setSigned(true);
        } catch (error) {
          // SÓ remove se o erro for realmente de autenticação (401)
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.get("/user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data;
          setUserInfo(userData);
        } catch (error) {
          logout();
        }
      }
    };

    fetchUser();
  }, [token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem("@EventFlow:token", userToken);
    localStorage.setItem("@EventFlow:user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("@EventFlow:token");
    localStorage.removeItem("@EventFlow:user");

    setUser(null);
    setToken(null);
    setSigned(false);
    setInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, info: userInfo, token, login, logout, signed: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
