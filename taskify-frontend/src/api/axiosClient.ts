import { notifications } from "@mantine/notifications";
import axios, { InternalAxiosRequestConfig } from "axios";

// const MOCK_TOKEN = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJibGFjazYwMTM3QGdtYWlsLmNvbSIsImV4cCI6MTcwMjc5MTAwNH0.J4KDh6obQ_wv1v9GvDJqru_kM8EoIfSIeUop_-zL5JCuvpsqo0f_KaUnn1nJ041H'
function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

const axiosClient = axios.create({
  baseURL: "/api",
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
    console.log("error", res);

    // 401 後續要做redirect login 或是login fail的處理
    if (res.status !== 401) {
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
