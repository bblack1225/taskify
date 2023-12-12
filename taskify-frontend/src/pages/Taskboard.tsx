import { Flex, Stack } from "@mantine/core";
import TaskColumn from "@/components/TaskColumn";
import style from "@/pages/Taskboard.module.scss";

function TaskBoard() {
  return (
    <Stack w={"100%"} style={{ overflow: "auto hidden" }}>
      <Flex className={style.container}>Taskify</Flex>
      <TaskColumn />
    </Stack>
  );
}

export default TaskBoard;
