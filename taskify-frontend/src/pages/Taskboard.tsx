import { Flex, Stack } from "@mantine/core";
import TaskColumn from "@/components/TaskColumn";
import style from "@/pages/Taskboard.module.scss";
import { useUser } from "@/hooks/useUser";
import { useOutletContext } from "react-router-dom";
import { IconArrowBigRightLine } from "@tabler/icons-react";

function TaskBoard() {
  const { isNavBoardOpen } = useOutletContext<{ isNavBoardOpen: boolean }>();
  const userInfo = useUser();

  const BoardTitle = () => {
    return isNavBoardOpen ? (
      <span className={style.boardNameStyle}>{userInfo.boardName}</span>
    ) : (
      <Flex align="center">
        看板
        <IconArrowBigRightLine size="1.2rem" />
        <span style={{ marginLeft: "6px" }} className={style.boardNameStyle}>
          {userInfo.boardName}
        </span>
      </Flex>
    );
  };

  return (
    <Stack w={"2000px"} style={{ overflow: "auto hidden" }}>
      <Flex className={style.container}>{BoardTitle()}</Flex>
      <TaskColumn />
    </Stack>
  );
}

export default TaskBoard;
