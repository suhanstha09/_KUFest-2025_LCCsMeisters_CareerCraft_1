import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;

  // Remove Content-Type header for FormData to let browser set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

export default axiosInstance;
