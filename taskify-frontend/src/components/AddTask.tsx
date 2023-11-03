import { ActionIcon, Button, Flex, Stack, Textarea } from "@mantine/core";
import style from "./AddTask.module.scss";
import { IconX } from "@tabler/icons-react";

function AddTask({
  isAddingTask,
  toggleAddingTask,
}: {
  isAddingTask: boolean;
  toggleAddingTask: (isAdding: boolean) => void;
}) {
  return (
    <>
      {isAddingTask && (
        <Stack className={style.addButtonContainer}>
          <Textarea
            autoFocus
            className={style.addTaskTextarea}
            placeholder="為這張卡片輸入標題..."
          />
          <Flex style={{ marginTop: "-8px", marginBottom: "-2px" }}>
            <Button className={style.addNewCardButton}>新增卡片</Button>
            <ActionIcon
              variant="transparent"
              color="white"
              aria-label="Close"
              size={"lg"}
              className={style.actionIcon}
              onClick={() => toggleAddingTask(false)}
            >
              <IconX />
            </ActionIcon>
          </Flex>
        </Stack>
      )}
    </>
  );
}

export default AddTask;
