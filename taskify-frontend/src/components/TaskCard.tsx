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
import { DelTaskRes } from "@/types/task";
import { notifications } from "@mantine/notifications";
import { AllDataResType, ColumnResType } from "@/types/column";
import { delTask } from "@/api/tasks";
import { useState } from "react";

type Props = {
  task: {
    id: string;
    name: string;
    description: string;
  };
};

function TaskCard({ task }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [openDelModal, setOpenDelModal] = useState(false);

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
            const delTask = column.tasks.filter((task) => {
              return task.id !== resData.delTaskId;
            });
            return {
              ...column,
              tasks: delTask,
            };
          }),
        };
        return NewData;
      });
      // queryClient.setQueryData(["tasks"], (oldData: ColumnResType) => {
      //   const NewData = {
      //     ...oldData,
      //     tasks: oldData.tasks.filter((task) => {
      //       task.id !== resData.delTaskId;
      //     }),
      //   };
      //   return NewData;
      // });
    },
  });

  const handleDelTask = (id: string) => {
    deleteTaskMutation.mutate(id);
    setOpenDelModal(false);
    close();
  };
  return (
    <>
      <Box className={style.taskContainer}>
        <Text onClick={open}>{task.name}</Text>
      </Box>
      <Modal.Root opened={opened} onClose={close} size={"lg"}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <IconBallpen />
            <Textarea
              style={{ flex: "2", margin: "0 10px" }}
              autosize
              value={task.name}
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
                <Editor />
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
