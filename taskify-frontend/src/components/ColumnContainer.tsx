import { ActionIcon, Box, Flex, Menu, Stack } from "@mantine/core";
import ColumnTitleTextarea from "./textarea/ColumnTitleTextarea";
import { IconDots, IconTrash } from "@tabler/icons-react";
import { ColumnResType } from "@/types/column";
import style from "@/components/TaskColumn.module.scss";
import TaskCardList from "./TaskCardList";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  column: ColumnResType;
  handleEditTitle: (id: string, title: string) => void;
  onDelMenuOpen: (id: string) => void;
};

export default function ColumnContainer({
  column,
  handleEditTitle,
  onDelMenuOpen,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const dndStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    flexShrink: 0,
    display: "flex",
  };
  return (
    <div style={dndStyles} ref={setNodeRef}>
      <Flex {...attributes} {...listeners}>
        <Box>
          <Stack className={style.columnContainer}>
            <Flex className={style.titleContainer}>
              <ColumnTitleTextarea
                id={column.id}
                title={column.title}
                onSave={handleEditTitle}
              />
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon
                    className={style.actionIcon}
                    variant="transparent"
                    aria-label="Settings"
                    color="white"
                    size={"lg"}
                  >
                    <IconDots size="1.125rem" />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>列表動作</Menu.Label>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconTrash />}
                    onClick={() => onDelMenuOpen(column.id)}
                  >
                    刪除列表
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
            <TaskCardList column={column} />
          </Stack>
        </Box>
      </Flex>
    </div>
  );
}
