import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import api from "../services/api";
const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("@EventFlow:token"));

  useEffect(() => {
    const storagedUser = localStorage.getItem("@EventFlow:user");
    if (storagedUser && token) {
      setUser(JSON.parse(storagedUser));
    }
  }, [token]);

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
