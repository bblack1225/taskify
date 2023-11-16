import { TaskLabel } from "../labels";

export type ColumnMutateRes = {
  id: string;
  boardId: string;
  title: string;
  dataIndex: number;
};

export type ColumnDeleteRes = {
  deleteColId: string;
};

export type ColumnResType = {
  id: string;
  title: string;
  color: string;
  dataIndex: number;
  tasks: BaseTaskRes[];
};

export type BaseDataRes = {
  boardId: string;
  boardName: string;
  columns: BaseColumnRes[];
  tasks: BaseTaskRes[];
};

export type BaseColumnRes = {
  id: string;
  title: string;
  color: string;
  dataIndex: number;
};

export type BaseTaskRes = {
  id: string;
  name: string;
  dataIndex: number;
  description: string;
  labels: TaskLabel[];
  columnId: string;
};
