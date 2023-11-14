export type ColumnMutateRes = {
  id: string;
  boardId: string;
  title: string;
  dataIndex: number;
};

export type ColumnDeleteRes = {
  deleteColId: string;
};

export type AllDataResType = {
  boardId: string;
  title: string;
  columns: ColumnResType[];
};

export type ColumnResType = {
  id: string;
  title: string;
  color: string;
  dataIndex: number;
  tasks: TasksResType[];
};

export type TasksResType = {
  id: string;
  name: string;
  dataIndex: number;
  description: string;
  labels: string[];
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
  labels: string[];
  columnId: string;
};
