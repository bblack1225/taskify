import {
  Card,
  Text,
  Badge,
  Group,
  ActionIcon,
  Box,
  Modal,
  Button,
} from "@mantine/core";
import { format, formatDistanceToNow } from "date-fns";
import { zhTW } from "date-fns/locale";
import { IconPin, IconTrash, IconPencil } from "@tabler/icons-react";
import { useState } from "react";
import style from "./BoardCard.module.scss";

interface BoardCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  themeColor: string;
  pinnedAt: boolean;
  createdAt: string;
  onPinToggle: (kanbanId: string) => void;
  onDelete: (kanbanId: string) => void;
  onEdit: (kanbanId: string) => void;
  onBoardClick: (kanbanId: string) => void;
}

export function BoardCard({
  id,
  name,
  description,
  icon,
  themeColor,
  pinnedAt,
  createdAt,
  // modifiedAt,
  onPinToggle,
  onDelete,
  onEdit,
  onBoardClick,
}: BoardCardProps): JSX.Element {
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  // 計算文字顏色基於背景亮度
  const getTextColor = (bgColor: string) => {
    if (!bgColor || bgColor === "transparent") return "#333";

    // 將十六進制顏色轉換為RGB
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // 計算亮度 (0-255)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 150 ? "#333" : "#fff";
  };

  return (
    <Card
      shadow="sm"
      p={0}
      radius="md"
      withBorder
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
      }}
      className={style.boardCard}
      onClick={() => onBoardClick(id)}
    >
      {/* 上半部背景和圖示 */}
      <Box
        p="md"
        style={{
          backgroundColor: themeColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100px",
        }}
      >
        <Text size="xl" style={{ color: getTextColor(themeColor) }}>
          {String.fromCodePoint(parseInt(icon, 16))}
        </Text>
      </Box>

      {/* 內容區域 */}
      <Box p="md" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Group justify="space-between" mb="xs">
          <Text
            fw={500}
            lineClamp={1}
            title={name}
            style={{ fontSize: "1.1rem" }}
          >
            {name}
          </Text>
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color={pinnedAt ? "yellow" : "gray"}
              onClick={(e) => {
                e.stopPropagation();
                onPinToggle(id);
              }}
              title={pinnedAt ? "取消置頂" : "置頂看板"}
            >
              <IconPin size={20} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              title="編輯看板"
            >
              <IconPencil size={20} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModalOpened(true);
              }}
              title="刪除看板"
            >
              <IconTrash size={20} />
            </ActionIcon>
          </Group>
        </Group>

        <Text
          size="sm"
          lineClamp={3}
          style={{ flex: 1, marginBottom: "0.5rem" }}
        >
          {description}
        </Text>

        <Group justify="space-between" mt="auto" gap="xs">
          <Text size="xs" style={{ fontSize: "0.75rem" }}>
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: zhTW,
            })}
          </Text>
          <Badge variant="outline" color="gray" size="sm">
            {format(new Date(createdAt), "yyyy/MM/dd", { locale: zhTW })}
          </Badge>
        </Group>
      </Box>

      <Modal
        opened={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        title="確認刪除"
        centered
      >
        <Text mb="md">確定要刪除此看板嗎？此操作無法復原。</Text>
        <Group justify="flex-end">
          <Button
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModalOpened(false);
            }}
          >
            取消
          </Button>
          <Button
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
              setDeleteModalOpened(false);
            }}
          >
            刪除
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}
