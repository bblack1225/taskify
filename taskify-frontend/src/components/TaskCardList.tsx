import { Stack, Button } from "@mantine/core";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";
import { BaseTaskRes, ColumnResType } from "@/types/column";
import { useState } from "react";
import style from "./TaskCardList.module.scss";

type Props = {
  column: ColumnResType;
};
const TaskCardList = ({ column }: Props) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [openedTasks, setOpenedTasks] = useState<string[]>([]);

  const handleTaskOpen = (taskId: string) => {
    setOpenedTasks((prevOpenedTasks) => [...prevOpenedTasks, taskId]);
  };

  const handleTaskClose = (taskId: string) => {
    setOpenedTasks((prevOpenedTasks) =>
      prevOpenedTasks.filter((id) => id !== taskId)
    );
  };

  return (
    <>
      <Stack className={style.taskContainer}>
        {column.tasks.map((task: BaseTaskRes) => (
          <TaskCard
            key={task.id}
            task={task}
            opened={openedTasks.includes(task.id)}
            open={() => handleTaskOpen(task.id)}
            close={() => handleTaskClose(task.id)}
          />
        ))}
        <AddTask
          column={column}
          isAddingTask={isAddingTask}
          toggleAddingTask={(val) => setIsAddingTask(val)}
        />
      </Stack>
      {isAddingTask || (
        <Stack className={style.addButtonContainer}>
          <Button
            variant="subtle"
            color="orange"
            radius="md"
            onClick={() => setIsAddingTask(true)}
          >
            + 新增卡片
          </Button>
        </Stack>
      )}
    </>
  );
};

export default TaskCardList;
