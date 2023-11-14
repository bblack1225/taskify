export type AddTaskReq = {
  name: string;
  dataIndex: number;
  statusColumnId: string;
  boardId: string;
};

export type TaskMutateRes = {
  id: string;
  name: string;
  description: string;
  dataIndex: number;
  statusColumnId: string;
  idLabels: string[];
};

export type EditTaskRes = {
  id: string;
  name: string;
  description: string;
  dataIndex: number;
  statusColumnId: string;
  labels: string[];
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
