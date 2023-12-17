import { Flex, Stack } from "@mantine/core";
import TaskColumn from "@/components/TaskColumn";
import style from "@/pages/Taskboard.module.scss";
import { useUser } from "@/hooks/useUser";

function TaskBoard() { 
  const userInfo = useUser();
  return (
    <Stack w={"2000px"} style={{ overflow: "auto hidden" }}>
      <Flex className={style.container}>{userInfo.boardName}</Flex>
      <TaskColumn />
    </Stack>
  );
}

export default TaskBoard;
