import { Button } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { IconArrowBigRightLine, IconArrowLeft } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { ReactElement, useEffect } from "react";
import TaskColumn from "@/components/TaskColumn";

interface LocationState {
  boardName: string;
}

export default function TaskBoard(): ReactElement {
  const { boardId } = useParams<{ boardId: string }>();
  const { isNavBoardOpen } = useOutletContext<{ isNavBoardOpen: boolean }>();
  const location = useLocation();

  // 滾動到頂部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [boardId]);

  // 從 location.state 中獲取看板名稱
  const boardName =
    (location.state as LocationState)?.boardName || `看板 ${boardId}`;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleBackToBoards = () => {
    // 清除所有查詢快取
    queryClient.clear();
    navigate("/allBoards");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={handleBackToBoards}
          size="sm"
          style={{
            color: "#495057",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          返回看板列表
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            padding: "10px 0",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#212529",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
            }}
          >
            {!isNavBoardOpen && (
              <>
                <span>看板</span>
                <IconArrowBigRightLine size="1.2rem" />
              </>
            )}
            <span>{boardName}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-start",
            paddingBottom: "20px",
            minHeight: "calc(100vh - 120px)",
            width: "100%",
          }}
        >
          <TaskColumn />
        </div>
      </div>
    </div>
  );
}
