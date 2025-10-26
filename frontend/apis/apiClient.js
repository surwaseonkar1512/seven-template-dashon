// api/apiClient.js
import axios from "axios";

// const BASE_URL = "https://mafpco-corp-site.onrender.com/api";
const BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
//
// Request interceptor (optional, for token injection)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
