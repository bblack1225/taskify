export type AddTaskReq = {
  name: string;
  dataIndex: number;
  statusColumnId: string;
  boardId: string;
};

export type DelTaskRes = {
  delTaskId: string;
};

export type UpdateDescReq = {
  id: string;
  description: string;
};

export type UpdateDescRes = {
  id: string;
  description: string;
};

export type UpdateDateReq = {
  id: string;
  startDate: string;
  dueDate: string;
};
