// http/index.js
import axios from "axios";

const BASE_URL = "http://localhost:5000";

// Инстанс для публичных (unauth) запросов
const $host = axios.create({
  baseURL: BASE_URL,
});

// Инстанс для авторизованных запросов
const $authHost = axios.create({
  baseURL: BASE_URL,
});

// Интерцептор подставит в заголовок Authorization Bearer-токен
$authHost.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export { $host, $authHost };
