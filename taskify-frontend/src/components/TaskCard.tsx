import {
  Box,
  Button,
  Flex,
  Group,
  HoverCard,
  Modal,
  Text,
  Textarea,
} from "@mantine/core";
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
import { DelTaskRes, UpdateDescReq, UpdateDescRes } from "@/types/task";
import { notifications } from "@mantine/notifications";
import { BaseDataRes, BaseTaskRes } from "@/types/column";
import { delTask, editTask, updateDesc } from "@/api/tasks";
import { useState } from "react";
import TaskMemberMenu from "./Menu/TaskMemberMenu";
import TaskLabelMenu from "./Menu/TaskLabelMenu";
import TaskDateMenu from "./Menu/TaskDateMenu";
import { TaskLabel } from "@/types/labels";

type Props = {
  task: BaseTaskRes;
};
function TaskCard({ task }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [editTaskTitle, setEditTaskTitle] = useState(task.name);

  const taskLabelIds = task.labels.map((label) => label.id);
  const queryClient = useQueryClient();
  const labels = queryClient.getQueryData<TaskLabel[]>(["labels"]);

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
        return {
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
      });
    },
  });

  const editTaskMutation = useMutation({
    // 因為name或labels的修改是使用同個api，所以可以擇一傳入，但一定要傳其中一個
    // 瞭改（日語）
    mutationFn: (editTaskTitle: {
      id: string;
      name?: string;
      labels?: string[];
    }) => editTask(editTaskTitle),

    onSuccess: (resData: BaseTaskRes) => {
      notifications.show({
        icon: <IconMoodCheck />,
        message: "更新成功",
        autoClose: 2000,
      });
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        const NewData = {
          ...oldData,
          tasks: oldData.tasks.map((oldTask) => {
            if (oldTask.id !== task.id) {
              return oldTask;
            } else {
              return resData;
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
    if (editTaskTitle === task.name || editTaskTitle === "") {
      setEditTaskTitle(task.name);
      return;
    }
    editTaskMutation.mutate({
      id: task.id,
      name: editTaskTitle,
    });
  };

  // TODO labelChange時要call api
  // const handleLabelChange = (labelIds: string[]) => {
  //   queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
  //     return {
  //       ...oldData,
  //       tasks: oldData.tasks.map((oldTask) => {
  //         if (oldTask.id !== task.id) {
  //           return oldTask;
  //         } else {
  //           return {
  //             ...oldTask,
  //             labels: labelIds.map((labelId) => {
  //               // 這邊的跟下面的做法就是會造成labels出現在modal上的順序差異，一個是以右側選單的順序，一個是以labelIds的順序
  //               return labels?.find((label) => label.id === labelId);
  //             }),
  //             // labels: labels?.filter((label) => labelIds.includes(label.id)),
  //           };
  //         }
  //       }),
  //     };
  //   });
  // };

  const handleLabelChange = (labelIds: string[]) => {
    editTaskMutation.mutate({
      id: task.id,
      labels: labelIds,
    });
    queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
      return {
        ...oldData,
        tasks: oldData.tasks.map((oldTask) => {
          if (oldTask.id !== task.id) {
            return oldTask;
          } else {
            return {
              ...oldTask,
              labels: labelIds.map((labelId) => {
                return labels?.find((label) => label.id === labelId);
              }),
            };
          }
        }),
      };
    });
  };

  const handleModal = (labelIds: string[]) => {
    editTaskMutation.mutate({
      id: task.id,
      labels: labelIds,
    });
  };

  return (
    <>
      <Box onClick={open} className={style.taskContainer}>
        <Flex style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {task.labels.map((label) => {
            return (
              <Group
                key={label.id}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                justify="center"
              >
                <HoverCard openDelay={300}>
                  <HoverCard.Target>
                    <div
                      style={{
                        backgroundColor: `${label.color}`,
                      }}
                      className={style.hoverCard}
                    />
                  </HoverCard.Target>
                  <HoverCard.Dropdown h={20} className={style.dropdown}>
                    <Text size="xs">標題：『{label.name}』</Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
            );
          })}
        </Flex>
        <Text style={{ marginLeft: "4px" }}>{editTaskTitle}</Text>
      </Box>
      <Modal.Root
        opened={opened}
        onClose={close}
        size={"700"}
        trapFocus={false}
        onBlur={() => handleModal}
      >
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
                  <Text className={style.tagText} c={"gray.6"} fw={600}>
                    標籤
                  </Text>
                  <Flex
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      width: "420px",
                    }}
                  >
                    {task.labels.map((label) => {
                      return (
                        <div
                          key={label.id}
                          style={{
                            backgroundColor: `${label.color}`,
                          }}
                          className={style.labelDiv}
                        >
                          <span>{label.name}</span>
                        </div>
                      );
                    })}
                  </Flex>
                </Flex>
                <Flex mt={15}>
                  <IconAlignBoxLeftStretch />
                  <Text ml={10} c={"gray.6"} fw={600}>
                    描述
                  </Text>
                </Flex>
                <Editor
                  description={task.description}
                  onSave={handleSaveDesc}
                />
              </Flex>
              <Flex direction={"column"} gap={8}>
                <Text size="xs" c={"gray.6"} fw={600}>
                  新增至卡片
                </Text>
                <TaskMemberMenu />
                {/* 目前將選定的labelId跟label改變的event handler當作props傳入 */}
                <TaskLabelMenu
                  selectedLabels={taskLabelIds}
                  onLabelChange={handleLabelChange}
                  onModalBlur={handleModal}
                />
                <TaskDateMenu />
                <Text size="xs" c={"gray.6"} fw={600}>
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
