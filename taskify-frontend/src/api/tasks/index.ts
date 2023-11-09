import axiosClient from "../axiosClient";
import {
  DelTaskRes,
  EditTaskRes,
  TaskMutateReq,
  TaskMutateRes,
  UpdateDescReq,
  UpdateDescRes,
} from "@/types/task";

export const addTask = (request: TaskMutateReq): Promise<TaskMutateRes> => {
  return axiosClient.post("/tasks", request);
};

export const delTask = (id: string): Promise<DelTaskRes> => {
  return axiosClient.delete(`/tasks/${id}`);
};

export const editTask = (editTask: {
  id: string;
  name: string;
  description: string;
  labels: string[];
  boardId: string;
}): Promise<EditTaskRes> => {
  return axiosClient.put(`/tasks/${editTask.id}`, editTask);
};

export const updateDesc = ({
  id,
  description,
}: UpdateDescReq): Promise<UpdateDescRes> => {
  return axiosClient.put(`/tasks/${id}/desc`, { description });
};
