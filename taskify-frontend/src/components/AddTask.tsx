import { ActionIcon, Button, Flex, Stack, Textarea } from "@mantine/core";
import style from "./AddTask.module.scss";
import { IconMoodCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask } from "@/api/tasks";
import { TaskMutateRes } from "@/types/task";
import { notifications } from "@mantine/notifications";
import { AllDataResType, ColumnResType, TasksResType } from "@/types/column";
import { BASE_DATA_INDEX } from "./AddColumn";

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
        const column = oldData.columns.find(
          (col) => col.id === resData.statusColumnId
        );
        column?.tasks.push(newData);

        return {
          ...oldData,
          columns: oldData.columns.map((oldColumn) => {
            if (oldColumn.id !== column?.id) {
              return oldColumn;
            } else {
              return column;
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
        dataIndex: BASE_DATA_INDEX,
        description: "",
        statusColumnId,
      });
    }
  };

  const handleBlur = () => {
    if (!newTask) {
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
            onBlur={handleBlur}
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
