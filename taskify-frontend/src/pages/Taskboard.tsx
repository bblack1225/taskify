import { Flex, Stack, Text, Button, Skeleton } from "@mantine/core";
import style from "@/pages/Taskboard.module.scss";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { IconArrowBigRightLine, IconArrowLeft } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { ReactElement, useEffect, useState } from "react";
import TaskColumn from "@/components/TaskColumn";

interface LocationState {
  boardName: string;
}

export default function TaskBoard(): ReactElement {
  const { boardId } = useParams<{ boardId: string }>();
  const { isNavBoardOpen } = useOutletContext<{ isNavBoardOpen: boolean }>();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  // 切換動畫階段
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 3);
    }, 500); // 每0.5秒切換一次
    return () => clearInterval(timer);
  }, []);

  // 滾動到頂部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [boardId]);

  // 模擬載入狀態
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [boardId]);

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

  const navigate = useNavigate();
  const handleBackToBoards = () => {
    navigate("/allBoards");
  };

  if (isLoading) {
    return (
      <Stack w={"2000px"} h="100vh" style={{ overflow: "auto hidden" }}>
        <Flex
          className={style.container}
          justify="space-between"
          align="center"
        >
          <Skeleton height={28} width={200} radius="sm" />
          <Skeleton height={36} width={120} radius="md" />
        </Flex>
        <Flex gap="md" p="md">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              style={{
                width: "300px",
                height:
                  index === animationPhase
                    ? "400px"
                    : index === animationPhase + 1
                    ? "300px"
                    : "200px",
                background: "rgba(0, 0, 0, 0.03)",
                borderRadius: "8px",
                transition: "all 0.5s ease-in-out",
                opacity: 0.8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  height: "30px",
                  width: "60%",
                  background: "rgba(0, 0, 0, 0.05)",
                  margin: "10px",
                  borderRadius: "4px",
                }}
              />
            </div>
          ))}
        </Flex>
      </Stack>
    );
  }

  return (
    <Stack w={"2000px"} h="100vh" style={{ overflow: "auto hidden" }}>
      <Flex className={style.container} justify="space-between" align="center">
        <BoardTitle />
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={handleBackToBoards}
          size="sm"
          mr="md"
        >
          返回看板列表
        </Button>
      </Flex>
      <TaskColumn />
    </Stack>
  );
}
