import { ColumnResType } from "@/types/column";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Box, Flex, Menu, Stack } from "@mantine/core";
import styles from "@/components/TaskColumn.module.scss";
import ColumnTitleTextarea from "./textarea/ColumnTitleTextarea";
import {
  IconDots,
  IconDragDrop2,
  IconGripHorizontal,
  IconGripVertical,
  IconTrash,
} from "@tabler/icons-react";
import TaskCardList from "./TaskCardList";
import { useEffect, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  column: ColumnResType;
  handleEditTitle: (id: string, title: string) => void;
  setCurrentDelId: (id: string) => void;
  open: () => void;
  clientWidth?: number;
  clientHeight?: number;
};

function TaskColumnItem({
  column,
  handleEditTitle,
  setCurrentDelId,
  open,
  clientWidth,
  clientHeight,
}: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
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

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const draggingStyle = {
    ...style,
    width: clientWidth,
    height: clientHeight,
  };

  if (isDragging) {
    return (
      <Flex>
        <Stack
          style={draggingStyle}
          ref={setNodeRef}
          className={styles.columnDragContainer}
        ></Stack>
      </Flex>
    );
  }

  return (
    <Flex>
      <Box>
        <Stack
          data-id={column.id}
          className={styles.columnContainer}
          style={style}
          ref={setNodeRef}
        >
          <Flex className={styles.titleContainer}>
            <IconGripVertical
              color="pink"
              cursor={"grab"}
              {...attributes}
              {...listeners}
              style={{ outline: "none" }}
            />
            <ColumnTitleTextarea
              id={column.id}
              title={column.title}
              onSave={handleEditTitle}
            />
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon
                  className={styles.actionIcon}
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
                  onClick={() => {
                    open();
                    setCurrentDelId(column.id);
                  }}
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
  );
}

export default TaskColumnItem;
