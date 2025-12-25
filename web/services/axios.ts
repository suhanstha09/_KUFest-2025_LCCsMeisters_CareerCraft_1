import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const REGISTER_ENDPOINT = "/users/auth/register/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");


  
  // config.url is RELATIVE to baseURL
  const isRegisterEndpoint = config.url?.includes(REGISTER_ENDPOINT);

  if (token && !isRegisterEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Let browser set Content-Type for FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  console.log("config",config.url)
  console.log("is register ",isRegisterEndpoint)

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default axiosInstance;
