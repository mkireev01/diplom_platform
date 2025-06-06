
import axios from "axios";

const BASE_URL = "http://localhost:5000";


const $host = axios.create({
  baseURL: BASE_URL,
});


const $authHost = axios.create({
  baseURL: BASE_URL,
});


$authHost.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export { $host, $authHost };
