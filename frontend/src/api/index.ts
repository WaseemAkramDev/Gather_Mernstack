import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let message = "Something went wrong!";
    if (error.response) {
      const { status, data }: any = error.response;
      if (status === 401) {
        localStorage.removeItem("token");
        message = "Session expired. Please log in again.";
        window.location.href = "/";
        toast.error(message);
        return Promise.reject(error);
      }
      if (data.code === "VALIDATION_ERROR" && data.errors) {
        const firstField = Object.keys(data.errors)[0];
        const firstError = data.errors[firstField]?.[0];
        message = firstError || data.message;
      } else if (data.message) {
        message = data.message;
      } else if (data.error) {
        message = data.error;
      }
    } else if (error.message) {
      message = error.message;
    }
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
