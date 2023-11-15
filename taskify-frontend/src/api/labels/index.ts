import { LabelRes } from "@/types/labels";
import axiosClient from "../axiosClient";

export const getAllLabels = (boardId: string): Promise<LabelRes> => {
  return axiosClient.get(`/labels/all/${boardId}`);
};
