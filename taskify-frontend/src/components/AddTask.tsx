import { ActionIcon, Button, Flex, Stack, Textarea } from "@mantine/core";
import style from "./AddTask.module.scss";
import { IconMoodCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask } from "@/api/tasks";
import { TaskMutateRes } from "@/types/task";
import { notifications } from "@mantine/notifications";
import { BaseDataRes, BaseTaskRes, ColumnResType } from "@/types/column";
import { calculateDataIndex } from "@/utils";
import { v4 as uuidv4 } from "uuid";

type Props = {
  isAddingTask: boolean;
  toggleAddingTask: (isAdding: boolean) => void;
  column: ColumnResType;
};
function AddTask({ isAddingTask, toggleAddingTask, column }: Props) {
  const [newTask, setNewTask] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const currentDataIndex = calculateDataIndex(column.tasks);
  const queryClient = useQueryClient();
  // TODO 為了取得 boardId，可能有更好的做法?
  const queryData = queryClient.getQueryData<BaseDataRes>([
    "tasks",
  ]) as BaseDataRes;
  const updateTask = useMutation({
    mutationFn: (newTask: {
      name: string;
      dataIndex: number;
      statusColumnId: string;
      boardId: string;
    }) => addTask(newTask),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const optimisticTask: BaseTaskRes = {
        id: uuidv4(),
        name: variables.name,
        dataIndex: variables.dataIndex,
        labels: [],
        columnId: variables.statusColumnId,
        description: "",
      };
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          tasks: [...oldData.tasks, optimisticTask],
        };
      });
      return { optimisticTask };
    },
    onSuccess: (resData: TaskMutateRes, variables, context) => {
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        notifications.show({
          icon: <IconMoodCheck />,
          message: "新增成功",
          autoClose: 2000,
        });
        const newData: BaseTaskRes = {
          id: resData.id,
          name: resData.name,
          description: resData.description,
          dataIndex: resData.dataIndex,
          labels: resData.labels,
          columnId: resData.statusColumnId,
        };
        return {
          ...oldData,
          tasks: oldData.tasks.map((task) => {
            return task.id === context?.optimisticTask.id ? newData : task;
          }),
        };
      });
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          tasks: oldData.tasks.filter(
            (task) => task.id !== context?.optimisticTask.id
          ),
        };
      });
    },
  });

  const handleAddTask = (name: string, statusColumnId: string) => {
    if (!newTask) {
      toggleAddingTask(false);
    } else if (newTask) {
      toggleAddingTask(false);
      updateTask.mutate({
        name,
        dataIndex: currentDataIndex,
        statusColumnId,
        boardId: queryData.boardId,
      });
    }
  };

  const handleBlur = (name: string, statusColumnId: string) => {
    if (!newTask) {
      toggleAddingTask(false);
    } else {
      updateTask.mutate({
        name,
        dataIndex: currentDataIndex,
        statusColumnId,
        boardId: queryData.boardId,
      });
      setNewTask("");
      toggleAddingTask(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      e.currentTarget.blur();
      toggleAddingTask(false);
    }
  };
  return (
    <>
      {isAddingTask && (
        <Stack className={style.addButtonContainer}>
          <Textarea
            autoFocus
            className={style.addTaskTextarea}
            placeholder="為這張卡片輸入標題..."
            onChange={(e) => setNewTask(e.target.value)}
            onBlur={() => handleBlur(newTask, column.id)}
            onKeyDown={(e) => handleKeyDown(e)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
          <Flex style={{ marginTop: "-4px" }}>
            <Button
              className={style.addNewCardButton}
              onClick={() => handleAddTask(newTask, column.id)}
            >
              新增卡片
            </Button>
            <ActionIcon
              variant="transparent"
              color="white"
              aria-label="Close"
              size={"lg"}
              className={style.actionIcon}
              onClick={() => toggleAddingTask(false)}
            >
              <IconX />
            </ActionIcon>
          </Flex>
        </Stack>
      )}
    </>
  );
}

export default AddTask;
