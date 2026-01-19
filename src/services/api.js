import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Verificamos se o erro foi 401 E se não estamos na página de login
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/")
    ) {
      localStorage.removeItem("@EventFlow:token");
      localStorage.removeItem("@EventFlow:user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
