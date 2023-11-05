import { Box, Button, Flex, Modal, Text, Textarea } from "@mantine/core";
import style from "@/components/TaskCard.module.scss";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAirBalloon,
  IconAlignBoxLeftStretch,
  IconBallpen,
} from "@tabler/icons-react";
import Editor from "./editor/Editor";

type Props = {
  task: {
    id: string;
    name: string;
    description: string;
  };
};

function TaskCard({ task }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

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
                <Button color="red" leftSection={<IconAirBalloon />}>
                  刪除任務
                </Button>
              </Flex>
            </Flex>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

export default TaskCard;
