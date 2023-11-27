import { TaskLabel } from "@/types/labels";
import axiosClient from "../axiosClient";

export const getAllLabels = (boardId: string): Promise<TaskLabel[]> => {
  return axiosClient.get(`/labels/all/${boardId}`);
};

export const editLabel = (editLabel: {
  id: string;
  name: string;
  color: string;
}): Promise<TaskLabel> => {
  return axiosClient.put(`/labels/${editLabel.id}`, {
    name: editLabel.name,
    color: editLabel.color,
  });
};

export const addLabel = ({
  boardId,
  name,
  color,
}: {
  boardId: string;
  name: string;
  color: string;
}): Promise<TaskLabel> => {
  return axiosClient.post(`/labels/${boardId}`, { name, color });
};

export const delLabel = (id: string): Promise<void> => {
  return axiosClient.delete(`/labels/${id}`);
};
