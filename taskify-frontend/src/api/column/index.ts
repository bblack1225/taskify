import { AddColumnResponse, AllDataResType } from "@/types/column";
import axiosClient from "../axiosClient";

export const addColumns = (requestData: {
  boardId: string;
  title: string;
  dataIndex: number;
}): Promise<AddColumnResponse> => {
  return axiosClient.post("/statusCol", requestData);
};

export const getAllColumns = (id: string): Promise<AllDataResType> => {
  return axiosClient.get(`/statusCol/all/${id}`);
};
