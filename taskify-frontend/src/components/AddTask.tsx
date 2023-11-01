import { ActionIcon, Button, Flex, Stack, Textarea } from "@mantine/core";
import { useState } from "react";
import style from "./TaskColumn.module.scss";
import styles from "./AddTask.module.scss";
import { IconX } from "@tabler/icons-react";

function AddTask() {
  const [isAddingTask, setIsAddingTask] = useState(false);

  return (
    <>
      {isAddingTask ? (
        <Stack className={style.addButtonContainer}>
          <Textarea
            className={styles.addTaskTextarea}
            placeholder="為這張卡片輸入標題..."
            autosize
          />
          <Flex>
            <Button>新增卡片</Button>
            <ActionIcon
              variant="transparent"
              color="white"
              aria-label="Close"
              size={"lg"}
              className={styles.actionIcon}
              onClick={() => setIsAddingTask(false)}
            >
              <IconX />
            </ActionIcon>
          </Flex>
        </Stack>
      ) : (
        <Stack className={style.addButtonContainer}>
          <Button color="#4592af" onClick={() => setIsAddingTask(true)}>
            + 新增卡片
          </Button>
        </Stack>
      )}
    </>
  );
}

export default AddTask;
