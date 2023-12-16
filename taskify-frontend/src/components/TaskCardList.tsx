import { Stack, Button } from "@mantine/core";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";
import { BaseTaskRes, ColumnResType } from "@/types/column";
import { useState } from "react";
import style from "./TaskCardList.module.scss";
import { SortableContext } from "@dnd-kit/sortable";

type Props = {
  column: ColumnResType;
};
const TaskCardList = ({ column }: Props) => {
  const [isAddingTask, setIsAddingTask] = useState(false);

  return (
    <>
      <Stack className={style.taskContainer}>
        {column.tasks.map((task: BaseTaskRes) => (
          <SortableContext
            key={task.id}
            items={column.tasks.map((task) => task.id)}
          >
            <TaskCard task={task} />
          </SortableContext>
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
