import { BoardData } from "@/types/board";
import axiosClient from "../axiosClient";

export const getBoards = () => {
  return axiosClient.get(`/boards/all`);
};

export const createBoard = (boardData: BoardData) => {
  return axiosClient.post(`/boards`, boardData);
};

export const editBoard = (editBoard: {
  id: string;
  name: string;
  description: string;
  icon: string;
  themeColor: string;
}) => {
  return axiosClient.put(`/boards/${editBoard.id}`, editBoard);
};

export const deleteBoard = (boardId: string) => {
  return axiosClient.delete(`/boards/${boardId}`);
};

export const togglePinBoard = (boardId: string) => {
  return axiosClient.post(`/boards/${boardId}/toggle-pin`);
};
