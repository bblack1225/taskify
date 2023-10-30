export type TaskBoard = {
  id: string;
  name: string;
  description?: string;
};

export type StatusColumn = {
  id: string;
  title: string;
  color?: string;
  dataIndex: number;
  boardId: string;
  tasks: Task[];
};

export type Task = {
  id: string;
  name: string;
  dataIndex: number;
  description?: string;
  statusColumnId: string;
  labels: Label[];
  assignee: string[];
};

export type Label = {
  id: string;
  boardId: string;
  name: string;
  color: string;
};

// 使用者在board的權限
// type UserBoardRole = "OWNER" | "ADMIN" | "MEMBER";
