export type AddColumnResponse = {
  id: string;
  boardId: string;
  title: string;
  dataIndex: number;
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
