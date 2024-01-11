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
import { useDroppable } from "@dnd-kit/core";
import SortableTaskItem from "@/hooks/SortableTaskItem";

type Props = {
  column: ColumnResType;
};
const TaskCardList = ({ column }: Props) => {
  const [isAddingTask, setIsAddingTask] = useState(false);

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <>
      <SortableContext
        id={column.id}
        items={column.tasks}
        strategy={verticalListSortingStrategy}
      >
        <Stack className={style.taskContainer} ref={setNodeRef}>
          {column.tasks.map((task: BaseTaskRes) => (
            <SortableTaskItem key={task.id} id={task.id}>
              <TaskCard task={task} />
            </SortableTaskItem>
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
      </SortableContext>
    </>
  );
};

export default TaskCardList;
