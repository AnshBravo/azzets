import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://126.0.0.1:6500/api";

const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },

  timeout: 10000, // 10 seconds
};

export const apiClient = axios.create(axiosConfig);

// Interceptors

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        "An unexpected error occurred on the client.",
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || null,
    };

    console.error(
      `[API Error Handler] ${customError.status} - ${customError.message}`,
      error,
    );

    if (customError.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }

    return Promise.reject(customError);
  },
);
