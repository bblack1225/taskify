import { ActionIcon, Button, Flex, Stack, Textarea } from "@mantine/core";
import style from "./AddTask.module.scss";
import { IconMoodCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask } from "@/api/tasks";
import { notifications } from "@mantine/notifications";
import { BaseDataRes, BaseTaskRes } from "@/types/column";
import { calculateDataIndex } from "@/utils";
import { v4 as uuidV4 } from "uuid";

type Props = {
  isAddingTask: boolean;
  toggleAddingTask: (isAdding: boolean) => void;
  // column: ColumnResType;
  columnId: string;
  tasks: BaseTaskRes[];
};
function AddTask({ isAddingTask, toggleAddingTask, columnId, tasks }: Props) {
  const [newTask, setNewTask] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const currentDataIndex = calculateDataIndex(tasks);
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
        id: uuidV4(),
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
    onSuccess: (resData: BaseTaskRes, _variables, context) => {
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        notifications.show({
          icon: <IconMoodCheck />,
          message: "新增成功",
          autoClose: 2000,
        });
        const newData: BaseTaskRes = {
          ...resData,
        };
        return {
          ...oldData,
          tasks: oldData.tasks.map((task) => {
            return task.id === context?.optimisticTask.id ? newData : task;
          }),
        };
      });
    },
    onError: (_err, _variables, context) => {
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
    setNewTask("");
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
        <Stack
          className={style.addButtonContainer}
          onMouseDown={(e) => e.preventDefault()}
        >
          <Textarea
            autoFocus
            className={style.addTaskTextarea}
            placeholder="為這張卡片輸入標題..."
            onChange={(e) => setNewTask(e.target.value)}
            onBlur={() => handleBlur(newTask, columnId)}
            onKeyDown={(e) => handleKeyDown(e)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
          <Flex style={{ marginTop: "-4px" }}>
            <Button
              className={style.addNewCardButton}
              onClick={() => handleAddTask(newTask, columnId)}
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
