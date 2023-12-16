import { ColumnResType } from "@/types/column";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Box, Flex, Menu, Stack } from "@mantine/core";
import styles from "@/components/TaskColumn.module.scss";
import ColumnTitleTextarea from "./textarea/ColumnTitleTextarea";
import { IconDots, IconTrash } from "@tabler/icons-react";
import TaskCardList from "./TaskCardList";
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  column: ColumnResType;
  handleEditTitle: (id: string, title: string) => void;
  setCurrentDelId: (id: string) => void;
  open: () => void;
};

function TaskColumnItem({
  column,
  handleEditTitle,
  setCurrentDelId,
  open,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.id,
      data: {
        type: "Column",
        column,
      },
      disabled: false,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      {!editMode && (
        <Flex>
          <Box>
            <Stack
              className={styles.columnContainer}
              style={style}
              ref={setNodeRef}
              {...attributes}
              {...listeners}
              // onClick={() => setEditMode(true)}
            >
              <Flex className={styles.titleContainer}>
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
      )}
    </>
  );
}

export default TaskColumnItem;
