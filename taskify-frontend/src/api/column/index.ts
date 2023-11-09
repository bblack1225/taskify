import { AllDataResType, ColumnDeleteRes, ColumnMutateRes } from "@/types/column";
import axiosClient from "../axiosClient";

export const getAllColumns = (id: string): Promise<AllDataResType> => {
  return axiosClient.get(`/statusCol/all/${id}`);
};

export const addColumn = (requestData: {
  boardId: string;
  title: string;
  dataIndex: number;
}): Promise<ColumnMutateRes> => {
  return axiosClient.post("/statusCol", requestData);
};

export const editColumn = (editColumn:{id: string, title: string}): Promise<ColumnMutateRes> => {
  return axiosClient.put(`/statusCol/${editColumn.id}`,{title: editColumn.title})
}

export const delColumn = (id:string):Promise<ColumnDeleteRes> => {
  return axiosClient.delete(`/statusCol/${id}`)
}