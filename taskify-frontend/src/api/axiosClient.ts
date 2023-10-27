import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // TODO 針對特定error code做處理
    return Promise.reject(error);
  }
);

export default axiosClient;
