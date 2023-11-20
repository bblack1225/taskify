import { TaskLabel } from "@/types/labels";
import axiosClient from "../axiosClient";

export const getAllLabels = (boardId: string): Promise<TaskLabel[]> => {
  return axiosClient.get(`/labels/all/${boardId}`);
};
