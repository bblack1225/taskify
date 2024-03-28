import { ColumnResType } from "@/types/column";
import { ActionIcon, Box, Flex, Stack } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import TaskCardList from "./TaskCardList";
import style from "./ColumnContainerOverlay.module.scss";

export default function ColumnContainerOverlay({
  column,
}: {
  column: ColumnResType;
}) {
  return (
    <div style={{ flexShrink: 0, display: "flex", height: "100%" }}>
      <Flex style={{ height: "100%" }}>
        <Box
          style={{
            height: "100%",
          }}
        >
          <Stack className={style.columnContainer}>
            <Flex className={style.titleContainer}>
              <Box className={style.taskTitle}>{column.title}</Box>
              <ActionIcon
                className={style.actionIcon}
                variant="transparent"
                aria-label="Settings"
                color="white"
                size={"lg"}
              >
                <IconDots size="1.125rem" />
              </ActionIcon>
            </Flex>
            <TaskCardList column={column} />
          </Stack>
        </Box>
      </Flex>
    </div>
  );
}
