export type TaskMutateReq = {
  name: string;
  dataIndex: number;
  statusColumnId: string;
};

export type TaskMutateRes = {
  id: string;
  name: string;
  description: string;
  dataIndex: number;
  statusColumnId: string;
  idLabels: string[];
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
