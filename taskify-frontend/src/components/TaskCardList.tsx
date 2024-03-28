import { Stack, Button } from "@mantine/core";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";
import { BaseTaskRes, ColumnResType } from "@/types/column";
import { useState } from "react";
import style from "./TaskCardList.module.scss";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type Props = {
  column: ColumnResType;
};
const TaskCardList = ({ column }: Props) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [openedTasks, setOpenedTasks] = useState<string[]>([]);
  const tasks = column.tasks;

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
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <Stack className={style.taskContainer}>
          {tasks.map((task: BaseTaskRes) => (
            <TaskCard
              key={task.id}
              task={task}
              opened={openedTasks.includes(task.id)}
              open={() => handleTaskOpen(task.id)}
              close={() => handleTaskClose(task.id)}
            />
          ))}

          <AddTask
            columnId={column.id}
            tasks={column.tasks}
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
      </SortableContext>
    </>
  );
};

export default TaskCardList;
