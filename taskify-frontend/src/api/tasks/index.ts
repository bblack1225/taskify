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
  startDate?: string;
  dueDate?: string;
}): Promise<BaseTaskRes> => {
  const { id, ...request } = editTask;
  return axiosClient.put(`/tasks/${id}`, request);
};

export const updateDesc = ({
  id,
  description,
}: UpdateDescReq): Promise<UpdateDescRes> => {
  return axiosClient.put(`/tasks/${id}/desc`, { description });
};

export const addTaskLabel = (taskId: string, labelId: string) => {
  return axiosClient.post(`/tasks/${taskId}/labels`, { labelId });
};

export const deleteTaskLabel = (taskId: string, labelId: string) => {
  return axiosClient.delete(`/tasks/${taskId}/labels/${labelId}`);
};
