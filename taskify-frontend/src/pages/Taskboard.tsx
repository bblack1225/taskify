import { Flex, Stack } from "@mantine/core";
import TaskColumn from "@/components/TaskColumn";
import style from "@/pages/Taskboard.module.scss";

function TaskBoard() {
  return (
    <Stack style={{ overflow: "auto hidden" }}>
      <Flex className={style.container}>
        <Flex>Taskify</Flex>
      </Flex>
      <TaskColumn />
    </Stack>
  );
}

export default TaskBoard;
