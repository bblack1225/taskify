import { notifications } from "@mantine/notifications";
import axios, { InternalAxiosRequestConfig } from "axios";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

const axiosClient = axios.create({
  baseURL: "https://taskify-api.zeabur.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

type ErrorType = {
  errorCode: number;
  errorMessage: string;
};

// setting up request interceptor
axiosClient.interceptors.request.use(authRequestInterceptor);
// setting up response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const res = error.response;
    if (res.status === 401) {
      const data = res.data as ErrorType;
      // token 無效轉跳 login
      if (data.errorMessage === "Invalid Token") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else {
      notifications.show({
        title: `Service Error ${res.errorCode}`,
        message: res.errorMessage,
        color: "red",
      });
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
