import { UserInfo } from "@/types/user";
import axiosClient from "../axiosClient";

export const getUserInfo = (): Promise<UserInfo> => {
  return axiosClient.get("/user/info");
};
