import axiosClient from "../axiosClient";
import { TaskMutateReq, TaskMutateRes } from "@/types/task";

export const addTask = (request: TaskMutateReq): Promise<TaskMutateRes> => {
  return axiosClient.post("/tasks", request);
};
