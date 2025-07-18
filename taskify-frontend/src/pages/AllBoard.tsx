import { useState, useEffect } from "react";
import {
  Title,
  Text,
  SimpleGrid,
  Button,
  Flex,
  Tabs,
  Badge,
  Center,
  Loader,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { CreateBoardModal } from "@/components/board/CreateBoardModal";
import { EditBoardModal } from "@/components/board/EditBoardModal";
import { BoardCard } from "@/components/board/BoardCard";
import style from "@/pages/AllBoard.module.scss";
import {
  createBoard,
  deleteBoard,
  editBoard,
  getBoards,
  togglePinBoard,
} from "@/api/boards";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BoardData } from "@/types/board";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";

interface Board {
  id: string;
  name: string;
  description: string;
  icon: string;
  themeColor: string;
  pinnedAt: boolean;
  createdAt: string;
  modifiedAt: string;
}

interface AllBoardContext {
  setIsNavBoardOpen: (isOpen: boolean) => void;
}

export default function AllBoard() {
  const { setIsNavBoardOpen } = useOutletContext<AllBoardContext>();
  const [opened, setOpened] = useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const [activeTab, setActiveTab] = useState<string | null>("all"); // 'all' 或 'pinned'
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const boardsMutation = useMutation({
    mutationFn: getBoards,
    onSuccess: (resData) => {
      setIsLoading(false);
      setBoards(resData as unknown as Board[]);
    },
    onError: (err) => {
      console.log("getBoards", err);
      setIsLoading(false); // 錯誤時也要關閉 loading
    },
  });

  // 監聽路由變化，清空資料並重新載入
  useEffect(() => {
    // 立即重置所有狀態
    setBoards([]);
    setIsLoading(true); // 設定載入狀態
    setActiveTab("all");
    setEditingBoard(null);

    // 立即載入新資料，不延遲
    boardsMutation.mutate();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      boardsMutation.mutate();
    },
    onError: (err) => {
      console.log("createBoard", err);
    },
  });

  const editBoardMutation = useMutation({
    mutationFn: editBoard,
    onSuccess: () => {
      boardsMutation.mutate();
      setEditingBoard(null);
    },
    onError: (err) => {
      console.log("editBoard", err);
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      boardsMutation.mutate();
    },
    onError: (err) => {
      console.log("deleteBoard", err);
    },
  });

  const togglePinBoardMutation = useMutation({
    mutationFn: togglePinBoard,
    onSuccess: () => {
      boardsMutation.mutate();
    },
    onError: (err) => {
      console.log("togglePinBoard", err);
    },
  });

  const handleCreateBoard = (values: {
    name: string;
    description: string;
    icon: string;
    themeColor: string;
  }) => {
    const newBoard: BoardData = {
      name: values.name,
      description: values.description,
      icon: values.icon,
      themeColor: values.themeColor,
    };
    createBoardMutation.mutate(newBoard);
  };

  const handleDeleteBoard = (boardId: string) => {
    deleteBoardMutation.mutate(boardId);
  };

  const handleEditBoard = (boardId: string) => {
    const boardToEdit = boards.find((b) => b.id === boardId);
    if (boardToEdit) {
      setEditingBoard(boardToEdit);
    }
  };

  const handleSaveBoard = (values: {
    name: string;
    description: string;
    icon: string;
    themeColor: string;
  }) => {
    if (!editingBoard) return;

    editBoardMutation.mutate({
      id: editingBoard.id,
      name: values.name,
      description: values.description,
      icon: values.icon,
      themeColor: values.themeColor,
    });

    setEditingBoard(null);
  };

  const handleBoardClick = (boardId: string, boardName: string) => {
    // 清除所有查詢快取
    queryClient.clear();

    // 使用 requestAnimationFrame 確保在下一幀再進行導航
    requestAnimationFrame(() => {
      navigate(`/board/${boardId}`, { state: { boardName } });
      // 延遲更新狀態，避免與路由切換動畫衝突
      setTimeout(() => setIsNavBoardOpen(false), 100);
    });
  };

  const handlePinToggle = (boardId: string) => {
    togglePinBoardMutation.mutate(boardId);
  };

  const filteredBoards =
    activeTab === "pinned" ? boards.filter((b) => b.pinnedAt) : boards;

  return (
    <div
      key={location.key}
      className={style.all_boardDiv}
      style={{ minHeight: "100vh" }}
    >
      <div className={style.contentWrapper}>
        <Flex justify="space-between" align="center" mb="xl">
          <div>
            <Title order={2} mb="xs">
              我的看板
            </Title>
            <Text>管理您的看板</Text>
          </div>
          <Button leftSection={<IconPlus size={16} />} onClick={open}>
            新增看板
          </Button>
        </Flex>

        <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
          <Tabs.List>
            <Tabs.Tab value="all">
              所有看板{" "}
              <Badge ml={5} variant="light" color="gray" size="xs">
                {boards.length}
              </Badge>
            </Tabs.Tab>
            <Tabs.Tab value="pinned">
              已置頂{" "}
              <Badge ml={5} variant="light" color="gray" size="xs">
                {boards.filter((b) => b.pinnedAt).length}
              </Badge>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        {loading ? (
          <Center>
            <Loader type="bars" color="blue" />
          </Center>
        ) : filteredBoards.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "300px",
              textAlign: "center",
            }}
          >
            <Text size="lg" mb="md">
              找不到看板
            </Text>
            <Text mb="md">
              {activeTab === "pinned"
                ? "您尚未置頂任何看板。點擊看板上的圖釘圖示可將其置頂。"
                : "建立您的第一個看板以開始使用"}
            </Text>
            {activeTab !== "pinned" && (
              <Button leftSection={<IconPlus size={16} />} onClick={open}>
                建立看板
              </Button>
            )}
          </div>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {filteredBoards.map((board) => (
              <BoardCard
                key={board.id}
                {...board}
                onBoardClick={() => handleBoardClick(board.id, board.name)}
                onPinToggle={handlePinToggle}
                onDelete={handleDeleteBoard}
                onEdit={handleEditBoard}
              />
            ))}
          </SimpleGrid>
        )}

        <CreateBoardModal
          opened={opened}
          onClose={close}
          onSubmit={handleCreateBoard}
        />

        {editingBoard && (
          <EditBoardModal
            opened={!!editingBoard}
            onClose={() => setEditingBoard(null)}
            board={editingBoard}
            onSave={handleSaveBoard}
          />
        )}
      </div>
    </div>
  );
}
