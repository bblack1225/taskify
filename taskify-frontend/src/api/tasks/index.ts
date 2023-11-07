import axiosClient from "../axiosClient";
import { DelTaskRes, TaskMutateReq, TaskMutateRes } from "@/types/task";

export const addTask = (request: TaskMutateReq): Promise<TaskMutateRes> => {
  return axiosClient.post("/tasks", request);
};

export const delTask = (id:string):Promise<DelTaskRes> => {
  return axiosClient.delete(`/tasks/${id}`)
}
