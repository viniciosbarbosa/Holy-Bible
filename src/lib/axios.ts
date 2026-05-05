import axios from "axios";

export const api = axios.create({
  // URL da API para a bíblia comum
  baseURL: "https://www.abibliadigital.com.br/api/",
  timeout: 10000, // 10 segundos para não travar o app se a API cair
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Erro: Centraliza o tratamento de falhas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aqui você pode disparar Toasts ou logs para serviços externos
    console.error("Network Error:", error.response?.status, error.message);
    return Promise.reject(error);
  },
);
