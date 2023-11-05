import { notifications } from "@mantine/notifications";
import axios from "axios";
const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

type ErrorType = {
  errorCode: number;
  errorMessage: string;
}
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const res = error.response.data as ErrorType;
    // TODO 針對特定error code做處理
    notifications.show({
      title: `Service Error ${res.errorCode}`,
      message: res.errorMessage,
      color: "red",
    
    })
    return Promise.reject(error);
  }
);

export default axiosClient;