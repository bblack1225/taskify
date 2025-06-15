import { Flex, Stack, Text } from "@mantine/core";
import style from "@/pages/Taskboard.module.scss";
import { useOutletContext, useLocation } from "react-router-dom";
import { IconArrowBigRightLine } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { ReactElement } from "react";
import TaskColumn from "@/components/TaskColumn";

interface LocationState {
  boardName: string;
}

export default function TaskBoard(): ReactElement {
  const { boardId } = useParams<{ boardId: string }>();
  const { isNavBoardOpen } = useOutletContext<{ isNavBoardOpen: boolean }>();
  const location = useLocation();

  // 從 location.state 中獲取看板名稱
  const boardName =
    (location.state as LocationState)?.boardName || `看板 ${boardId}`;

  const BoardTitle = (): ReactElement =>
    isNavBoardOpen ? (
      <Text className={style.boardNameStyle} lineClamp={1}>
        {boardName}
      </Text>
    ) : (
      <Flex align="center">
        看板
        <IconArrowBigRightLine size="1.2rem" />
        <Text
          style={{ marginLeft: "6px" }}
          className={style.boardNameStyle}
          lineClamp={1}
        >
          {boardName}
        </Text>
      </Flex>
    );

  return (
    <Stack w={"2000px"} style={{ overflow: "auto hidden" }}>
      <Flex className={style.container}>
        <BoardTitle />
      </Flex>
      <TaskColumn />
    </Stack>
  );
}
