import axios from "axios";

// const BASE_URL = "https://mafpco-corp-site.onrender.com/api";
const BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor for token injection
apiClient.interceptors.request.use((config) => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser); // 👈 Parse from JSON string
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (error) {
    console.error("Error parsing user token:", error);
  }
  return config;
});

export default apiClient;
