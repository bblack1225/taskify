import { Box, Button, Flex, Modal, Text, Textarea } from "@mantine/core";
import style from "@/components/TaskCard.module.scss";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAirBalloon,
  IconAlignBoxLeftStretch,
  IconBallpen,
  IconMoodCheck,
} from "@tabler/icons-react";
import Editor from "./editor/Editor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DelTaskRes,
  EditTaskRes,
  UpdateDescReq,
  UpdateDescRes,
} from "@/types/task";
import { notifications } from "@mantine/notifications";
import { AllDataResType } from "@/types/column";
import { delTask, editTask, updateDesc } from "@/api/tasks";
import { useState } from "react";

type Props = {
  task: {
    id: string;
    name: string;
    description: string;
    labels: string[];
  };
  columnId: string;
};

function TaskCard({ task, columnId }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [editTaskTitle, setEditTaskTitle] = useState(task.name);
  const queryClient = useQueryClient();
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => {
      return delTask(id);
    },
    onSuccess: (resData: DelTaskRes) => {
      notifications.show({
        icon: <IconMoodCheck />,
        message: "刪除任務成功",
        autoClose: 2000,
      });
      queryClient.setQueryData(["tasks"], (oldData: AllDataResType) => {
        const NewData = {
          ...oldData,
          columns: oldData.columns.map((column) => {
            if (column.id !== columnId) {
              return column;
            } else {
              return {
                ...column,
                tasks: column.tasks.filter(
                  (oldTask) => oldTask.id !== resData.delTaskId
                ),
              };
            }
          }),
        };
        return NewData;
      });
    },
  });

  const updateTaskDescMutation = useMutation({
    mutationFn: (variables: UpdateDescReq) => {
      return updateDesc(variables);
    },
    onSuccess: (resData: UpdateDescRes) => {
      queryClient.setQueryData(["tasks"], (oldData: AllDataResType) => {
        const NewData = {
          ...oldData,
          columns: oldData.columns.map((column) => {
            if (column.id !== columnId) {
              return column;
            } else {
              return {
                ...column,
                tasks: column.tasks.map((oldTask) => {
                  if (oldTask.id !== task.id) {
                    return oldTask;
                  } else {
                    return {
                      ...oldTask,
                      description: resData.description,
                    };
                  }
                }),
              };
            }
          }),
        };
        return NewData;
      });
    },
  });

  const editTaskMutation = useMutation({
    mutationFn: (
      taskId: string,
      editTaskTitle: {
        name: string;
        description: string;
        labels: string[];
        boardId: string;
      }
    ) => editTask(taskId, editTaskTitle),
    onSuccess: (resData: EditTaskRes) => {
      notifications.show({
        icon: <IconMoodCheck />,
        message: "更新成功",
        autoClose: 2000,
      });
      queryClient.setQueryData(["tasks"], (oldData: AllDataResType) => {
        const NewData = {
          ...oldData,
          columns: oldData.columns.map((column) => {
            if (column.id !== columnId) {
              return column;
            } else {
              return {
                ...column,
                tasks: column.tasks.map((oldTask) => {
                  if (oldTask.id !== task.id) {
                    return oldTask;
                  } else {
                    return {
                      ...oldTask,
                      name: resData.name,
                    };
                  }
                }),
              };
            }
          }),
        };
        return NewData;
      });
    },
  });

  const handleDelTask = (id: string) => {
    deleteTaskMutation.mutate(id);
    setOpenDelModal(false);
    close();
  };

  const handleSaveDesc = (description: string) => {
    updateTaskDescMutation.mutate({
      id: task.id,
      description,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleBlur = () => {
    if (task.name === editTaskTitle || editTaskTitle === "") {
      setEditTaskTitle(task.name);
      return;
    }
    editTaskMutation.mutate(task.id, {
      name: task.name,
      description: task.description,
      labels: task.labels,
      boardId: columnId,
    });
  };

  return (
    <>
      <Box onClick={open} className={style.taskContainer}>
        <Text>{editTaskTitle}</Text>
      </Box>
      <Modal.Root opened={opened} onClose={close} size={"lg"} trapFocus={false}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <IconBallpen />
            <Textarea
              className={style.taskTitleTextarea}
              value={editTaskTitle}
              autosize
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(e)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onChange={(e) => setEditTaskTitle(e.target.value)}
            />
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Flex justify={"space-between"}>
              <Flex direction={"column"}>
                <Flex>
                  <IconAlignBoxLeftStretch />
                  <Text ml={10}>描述</Text>
                </Flex>
                <Editor
                  description={task.description}
                  onSave={handleSaveDesc}
                />
              </Flex>
              <Flex direction={"column"} gap={5}>
                <Text size="sm" c={"gray.6"} fw={600}>
                  動作
                </Text>
                <Button
                  color="red"
                  leftSection={<IconAirBalloon />}
                  onClick={() => setOpenDelModal(true)}
                >
                  刪除任務
                </Button>
              </Flex>
            </Flex>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <Modal
        opened={openDelModal}
        onClose={() => setOpenDelModal(false)}
        radius={10}
        size="xs"
        title="請問確定要刪除此任務嗎？"
        overlayProps={{
          backgroundOpacity: 0.1,
          blur: 2,
        }}
      >
        <Button
          color="red"
          leftSection={<IconAirBalloon />}
          onClick={() => handleDelTask(task.id)}
        >
          刪除任務
        </Button>
      </Modal>
    </>
  );
}

export default TaskCard;
