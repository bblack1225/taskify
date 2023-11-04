import { Stack, Button } from "@mantine/core";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";
import { ColumnResType, TasksResType } from "@/types/column";
import { useState } from "react";
import style from "./TaskCardList.module.scss";

type Props = {
  column: ColumnResType;
};
const TaskCardList = ({ column }: Props) => {
  const [isAddingTask, setIsAddingTask] = useState(false);

  return (
    <>
      <Stack className={style.taskContainer}>
        {column.tasks.map((task: TasksResType) => (
          <TaskCard key={task.id} task={task} />
        ))}
        <AddTask
          column={column}
          isAddingTask={isAddingTask}
          toggleAddingTask={(val) => setIsAddingTask(val)}
        />
      </Stack>
      {isAddingTask || (
        <Stack className={style.addButtonContainer}>
          <Button color="#4592af" onClick={() => setIsAddingTask(true)}>
            + 新增卡片
          </Button>
        </Stack>
      )}
    </>
  );
};

export default TaskCardList;
