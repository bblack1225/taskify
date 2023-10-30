export type TaskMutateReq = {
  name: string;
  dataIndex: number;
  description?: string;
  statusColumnId: string;
};
export type TaskMutateRes = {
  id: string;
  name: string;
  dataIndex: number;
  description?: string;
  statusColumnId: string;
};
