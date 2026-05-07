import axios from "axios";

// He actualizado el valor por defecto a tu nueva URL de Vercel
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://orders-api-1.vercel.app/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
