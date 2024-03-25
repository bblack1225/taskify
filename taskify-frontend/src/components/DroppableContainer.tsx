import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Box, Flex, Menu, Stack } from "@mantine/core";
import ColumnTitleTextarea from "./textarea/ColumnTitleTextarea";
import { IconDots, IconTrash } from "@tabler/icons-react";
import styles from "@/components/TaskColumn.module.scss";

type Props = {
  id: string;
  title: string;
  onDelMenuOpen: () => void;
  onTitleSave: (id: string, value: string) => void;
  items: string[];
  children: React.ReactNode;
};

export default function DroppableContainer({
  id,
  title,
  onDelMenuOpen,
  onTitleSave,
  items,
  children,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    // TODO 不知道要幹嘛用的
    data: {
      type: "container",
      children: items,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    flexShrink: 0,
    display: "flex",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Flex>
        <Box>
          <Stack className={styles.columnContainer}>
            <Flex className={styles.titleContainer}>
              <ColumnTitleTextarea id={id} title={title} onSave={onTitleSave} />
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
                    onClick={onDelMenuOpen}
                  >
                    刪除列表
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              {/* <ActionIcon
                size={"lg"}
                variant="transparent"
                color="white"
                style={{ cursor: "grab" }}
              >
                <IconGripVertical size="1.125rem" />
              </ActionIcon> */}
            </Flex>
            {children}
          </Stack>
        </Box>
      </Flex>
    </div>
  );
}
