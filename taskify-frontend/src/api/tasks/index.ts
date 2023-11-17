import { BaseTaskRes } from "@/types/column";
import axiosClient from "../axiosClient";
import {
  DelTaskRes,
  AddTaskReq,
  UpdateDescReq,
  UpdateDescRes,
} from "@/types/task";

export const addTask = (request: AddTaskReq): Promise<BaseTaskRes> => {
  return axiosClient.post("/tasks", request);
};

export const delTask = (id: string): Promise<DelTaskRes> => {
  return axiosClient.delete(`/tasks/${id}`);
};

export const editTask = (editTask: {
  id: string;
  name?: string;
  labels?: string[];
}): Promise<BaseTaskRes> => {
  return axiosClient.put(`/tasks/${editTask.id}`, editTask);
};

export const updateDesc = ({
  id,
  description,
}: UpdateDescReq): Promise<UpdateDescRes> => {
  return axiosClient.put(`/tasks/${id}/desc`, { description });
};
