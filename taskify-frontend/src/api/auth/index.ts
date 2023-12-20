import axiosClient from "../axiosClient";

export type LoginRes = {
  token: string;
  email: string;
};

export const login = (requestData: {
  email: string;
  password: string;
}): Promise<LoginRes> => {
  return axiosClient.post("/auth/login", requestData);
};
