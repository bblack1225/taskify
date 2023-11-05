import { ActionIcon, Button, Flex, Stack, Textarea } from "@mantine/core";
import style from "./AddTask.module.scss";
import { IconMoodCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask } from "@/api/tasks";
import { TaskMutateRes } from "@/types/task";
import { notifications } from "@mantine/notifications";
import { AllDataResType, ColumnResType, TasksResType } from "@/types/column";
import { calculateDataIndex } from "@/utils";

function AddTask({
  isAddingTask,
  toggleAddingTask,
  column,
}: {
  isAddingTask: boolean;
  toggleAddingTask: (isAdding: boolean) => void;
  column: ColumnResType;
}) {
  const [newTask, setNewTask] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const currentDataIndex = calculateDataIndex(column.tasks);
  const queryClient = useQueryClient();
  const updateTask = useMutation({
    mutationFn: (newTask: {
      name: string;
      dataIndex: number;
      description: string;
      statusColumnId: string;
    }) => addTask(newTask),
    onSuccess: (resData: TaskMutateRes) => {
      queryClient.setQueryData(["tasks"], (oldData: AllDataResType) => {
        notifications.show({
          icon: <IconMoodCheck />,
          message: "新增成功",
          autoClose: 2000,
        });
        console.log("old", oldData);

        const newData: TasksResType = {
          id: resData.id,
          name: resData.name,
          description: resData.description,
          dataIndex: resData.dataIndex,
          labels: [],
        };
        return {
          ...oldData,
          columns: oldData.columns.map((oldColumn) => {
            if (oldColumn.id !== column.id) {
              return oldColumn;
            } else {
              return {
                ...oldColumn,
                tasks: [...oldColumn.tasks, newData],
              };
            }
          }),
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
        description: "",
        statusColumnId,
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
        description: "",
        statusColumnId,
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
