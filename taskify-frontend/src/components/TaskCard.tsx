import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  HoverCard,
  Modal,
  Text,
  Textarea,
  isLightColor,
} from "@mantine/core";
import style from "@/components/TaskCard.module.scss";
import {
  IconAlignBoxLeftStretch,
  IconBallpen,
  IconCalendarCheck,
  IconMoodCheck,
  IconTag,
  IconTrash,
} from "@tabler/icons-react";
import Editor from "./editor/Editor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DelTaskRes,
  UpdateDateReq,
  UpdateDescReq,
  UpdateDescRes,
} from "@/types/task";
import { notifications } from "@mantine/notifications";
import { BaseDataRes, BaseTaskRes } from "@/types/column";
import {
  addTaskLabel,
  delTask,
  deleteTaskLabel,
  editTask,
  updateDesc,
} from "@/api/tasks";
import { useEffect, useRef, useState } from "react";
import TaskLabelMenu from "./Menu/TaskLabelMenu";
import TaskDateMenu from "./Menu/TaskDateMenu";
import { TaskLabel } from "@/types/labels";
import { useLabelsData } from "@/context/useLabelsData";

type Props = {
  task: BaseTaskRes;
  opened: boolean;
  open: () => void;
  close: () => void;
};

function findLabelsByLabelIds(
  labels: TaskLabel[],
  labelIds: string[]
): TaskLabel[] {
  return labels.filter((label) => labelIds.includes(label.id));
}

function TaskCard({ task, open, close, opened }: Props) {
  const [openDelModal, setOpenDelModal] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [editTaskTitle, setEditTaskTitle] = useState(task.name);

  const queryClient = useQueryClient();
  const labels = useLabelsData();

  const [taskLabels, setTaskLabels] = useState<TaskLabel[]>(
    findLabelsByLabelIds(labels, task.labels)
  );
  const isInitialMount = useRef(true);

  // 使用ref避免第一次render時，除了state初值外，也會執行effect
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setTaskLabels(findLabelsByLabelIds(labels, task.labels));
    }
  }, [labels, task.labels]);

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
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        const NewData = {
          ...oldData,
          tasks: oldData.tasks.filter(
            (oldTask) => oldTask.id !== resData.delTaskId
          ),
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
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        const newData = {
          ...oldData,
          tasks: oldData.tasks.map((oldTask) => {
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
        return newData;
      });
    },
  });

  const editTaskMutation = useMutation({
    mutationFn: (taskEdit: {
      id: string;
      name?: string;
      startDate?: string;
      dueDate?: string;
    }) => editTask(taskEdit),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          tasks: oldData.tasks.map((oldTask) => {
            if (oldTask.id !== task.id) {
              return oldTask;
            } else {
              return {
                ...oldTask,
                name: variables.name ?? oldTask.name,
                startDate: variables.startDate ?? oldTask.startDate,
                dueDate: variables.dueDate ?? oldTask.dueDate,
              };
            }
          }),
        };
      });
      return { previousTasks };
    },
    onSuccess: (resData: BaseTaskRes) => {
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          tasks: oldData.tasks.map((oldTask) => {
            if (oldTask.id !== task.id) {
              return oldTask;
            } else {
              return resData;
            }
          }),
        };
      });
    },
    onError(_err, _variables, context) {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
  });

  const deleteTaskLabelMutation = useMutation({
    mutationFn: ({ taskId, labelId }: { taskId: string; labelId: string }) => {
      return deleteTaskLabel(taskId, labelId);
    },
    onMutate: async ({ taskId, labelId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          tasks: oldData.tasks.map((oldTask) => {
            if (oldTask.id !== taskId) {
              return oldTask;
            } else {
              return {
                ...oldTask,
                labels: oldTask.labels.filter(
                  (oldTaskLabel) => oldTaskLabel !== labelId
                ),
              };
            }
          }),
        };
      });
      return { previousTasks };
    },
    onError(_err, _variables, context) {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
  });

  const addTaskLabelMutation = useMutation({
    mutationFn: ({ taskId, labelId }: { taskId: string; labelId: string }) => {
      return addTaskLabel(taskId, labelId);
    },
    onMutate: async ({ taskId, labelId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          tasks: oldData.tasks.map((oldTask) => {
            if (oldTask.id !== taskId) {
              return oldTask;
            } else {
              return {
                ...oldTask,
                labels: [...oldTask.labels, labelId],
              };
            }
          }),
        };
      });
      return { previousTasks };
    },
    onError(_err, _variables, context) {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
  });

  const handleUpdateDate = (data: UpdateDateReq) => {
    editTaskMutation.mutate({
      id: data.id,
      startDate: data.startDate,
      dueDate: data.dueDate,
    });
  };
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
    if (editTaskTitle === task.name || editTaskTitle === "") {
      setEditTaskTitle(task.name);
      return;
    }
    editTaskMutation.mutate({
      id: task.id,
      name: editTaskTitle,
    });
  };

  const handleLabelChange = (labelId: string, checked: boolean) => {
    if (checked) {
      addTaskLabelMutation.mutate({ taskId: task.id, labelId });
    } else {
      deleteTaskLabelMutation.mutate({ taskId: task.id, labelId });
    }
  };

  return (
    <>
      <Box onClick={open} className={style.taskContainer}>
        {taskLabels.length > 0 && (
          <Flex
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
              marginBottom: 5,
            }}
          >
            {taskLabels.map((label) => {
              return (
                <Group
                  key={label.id}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  justify="center"
                >
                  <HoverCard openDelay={300} position="top">
                    <HoverCard.Target>
                      <div
                        style={{
                          backgroundColor: `${label.color}`,
                        }}
                        className={style.hoverCard}
                      />
                    </HoverCard.Target>
                    <HoverCard.Dropdown h={20} className={style.dropdown}>
                      <Text size="sm">標題：『{label.name}』</Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </Group>
              );
            })}
          </Flex>
        )}
        <Text style={{ marginLeft: "4px" }} className={style.editTaskTitle}>
          {editTaskTitle}
        </Text>
      </Box>
      {opened && (
        <>
          <Modal.Root
            opened={opened}
            onClose={close}
            size={"700"}
            trapFocus={false}
            closeOnEscape={false}
          >
            <Modal.Overlay />
            <Modal.Content>
              <Modal.Header
                style={{
                  boxShadow: "0 1px 8px rgb(0 0 0 / 0.2)",
                  width: "100%",
                }}
              >
                <IconBallpen stroke={1.5} size={24} />
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
              <Modal.Body style={{ marginTop: "12px" }}>
                <Flex justify={"space-between"} gap={10}>
                  <Flex direction={"column"}>
                    <Flex mt={15}>
                      <IconTag stroke={1.5} size={24} />
                      <Text mx={8} c={"gray.6"} fw={600}>
                        標籤
                      </Text>
                      <Flex
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          width: "80%",
                          alignItems: "center",
                        }}
                      >
                        {taskLabels.length === 0 ? (
                          <Flex>
                            <Text size="sm" c={"gray.5"} fw={600} ml={5}>
                              [點擊右側標籤按鈕即可新增]
                            </Text>
                          </Flex>
                        ) : (
                          taskLabels.map((label) => {
                            return (
                              <Flex
                                key={label.id}
                                style={{
                                  backgroundColor: `${label.color}`,
                                }}
                                className={style.labelDiv}
                              >
                                <Text
                                  size="sm"
                                  c={
                                    isLightColor(label.color)
                                      ? "black"
                                      : "white"
                                  }
                                >
                                  {label.name}
                                </Text>
                              </Flex>
                            );
                          })
                        )}
                      </Flex>
                    </Flex>
                    <Flex mt={15}>
                      <IconCalendarCheck stroke={1.5} size={24} />
                      <Text mx={8} c={"gray.6"} fw={600}>
                        日期
                      </Text>
                      <Flex
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          width: "420px",
                          alignItems: "center",
                        }}
                      >
                        {task.startDate ? (
                          <Text size="sm" fw={600} ml={5}>
                            {task.startDate?.substring(0, 10)}
                            {task.dueDate &&
                              `~${task.dueDate?.substring(0, 10)}`}
                          </Text>
                        ) : (
                          <Text size="sm" fw={600} c={"gray.5"} ml={5}>
                            [點擊右側日期按鈕即可新增]
                          </Text>
                        )}
                      </Flex>
                    </Flex>
                    <Flex mt={15}>
                      <IconAlignBoxLeftStretch stroke={1.5} size={24} />
                      <Text mx={8} c={"gray.6"} fw={600}>
                        描述
                      </Text>
                    </Flex>
                    <Editor
                      description={task.description}
                      onSave={handleSaveDesc}
                    />
                  </Flex>
                  <Flex
                    direction={"column"}
                    gap={8}
                    style={{ marginTop: "12px" }}
                  >
                    <Text size="sm" c={"gray.6"} fw={600}>
                      新增至卡片
                    </Text>
                    {/* <TaskMemberMenu /> */}
                    {/* 目前將選定的labelId跟label改變的event handler當作props傳入 */}
                    <TaskLabelMenu
                      selectedLabels={taskLabels.map((label) => label.id)}
                      onLabelChange={handleLabelChange}
                    />
                    <TaskDateMenu
                      task={task}
                      handleUpdateDate={handleUpdateDate}
                    />
                    <Text size="sm" c={"gray.6"} fw={600}>
                      動作
                    </Text>
                    <Button
                      color="red"
                      leftSection={<IconTrash stroke={1.5} size={24} />}
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
            centered
            opened={openDelModal}
            onClose={() => setOpenDelModal(false)}
            radius={10}
            size="sm"
            title="您確定要刪除此任務嗎？"
            overlayProps={{
              backgroundOpacity: 0.1,
              blur: 2,
            }}
          >
            <Center>
              <Button color="red" onClick={() => handleDelTask(task.id)}>
                確定刪除
              </Button>
            </Center>
          </Modal>
        </>
      )}
    </>
  );
}

export default TaskCard;
