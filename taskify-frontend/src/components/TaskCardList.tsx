import { Stack, Button } from "@mantine/core";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";
import { BaseTaskRes } from "@/types/column";
import { useState } from "react";
import style from "./TaskCardList.module.scss";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import SortableTaskItem from "@/hooks/SortableTaskItem";

type Props = {
  // column: ColumnResType;
  columnId: string;
  tasks: BaseTaskRes[];
};
const TaskCardList = ({ columnId, tasks }: Props) => {
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

  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <>
      <SortableContext
        // id={column.id}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <Stack className={style.taskContainer} ref={setNodeRef}>
          {tasks.map((task: BaseTaskRes) => (
            <SortableTaskItem key={task.id} id={task.id}>
              <TaskCard
                key={task.id}
                task={task}
                opened={openedTasks.includes(task.id)}
                open={() => handleTaskOpen(task.id)}
                close={() => handleTaskClose(task.id)}
              />
            </SortableTaskItem>
          ))}

          <AddTask
            columnId={columnId}
            tasks={tasks}
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
