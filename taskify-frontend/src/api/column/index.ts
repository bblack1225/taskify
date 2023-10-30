import { AllDataResType, ColumnMutateRes } from "@/types/column";
import axiosClient from "../axiosClient";

export const getAllColumns = (id: string): Promise<AllDataResType> => {
  return axiosClient.get(`/statusCol/all/${id}`);
};

export const addColumns = (requestData: {
  boardId: string;
  title: string;
  dataIndex: number;
}): Promise<ColumnMutateRes> => {
  return axiosClient.post("/statusCol", requestData);
};

export const editColumns = (editColumns:{id: string, title: string}): Promise<ColumnMutateRes> => {
  return axiosClient.put(`/statusCol/${editColumns.id}`,{title: editColumns.title})
}