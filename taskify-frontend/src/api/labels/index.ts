import { TaskLabel } from "@/types/labels";
import axiosClient from "../axiosClient";

export const getAllLabels = (boardId: string): Promise<TaskLabel> => {
  return axiosClient.get(`/labels/all/${boardId}`);
};

export const editLabels = (editLabel: {
  id: string;
  name: string;
  color: string;
}): Promise<TaskLabel> => {
  return axiosClient.put(`/labels/${editLabel.id}`, {
    name: editLabel.name,
    color: editLabel.color,
  });
};
