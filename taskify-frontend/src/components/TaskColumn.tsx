import { Box, Button, Flex, Stack, TextInput } from "@mantine/core";
import style from "@/components/TaskColumn.module.scss";
import TaskCard from "./TaskCard";
import NewCardModal from "./NewCardModal";
import { useState } from "react";

const COLUMN_DATA = [
  {
    id: 1,
    title: "To Do",
    tasks: [
      {
        id: 1,
        title: "Task 1",
        description: "This is a test task",
      },
      {
        id: 2,
        title: "Task 2",
        description: "This is another test task",
      },
      {
        id: 3,
        title: "Task 3",
        description: "This is yet another test task",
      },
      {
        id: 4,
        title: "Task 4",
        description: "This is yet another test task",
      },
      {
        id: 5,
        title: "Task 5",
        description: "This is yet another test task",
      },
      {
        id: 6,
        title: "Task 6",
        description: "This is yet another test task",
      },
      {
        id: 7,
        title: "Task 7",
        description: "This is yet another test task",
      },
      {
        id: 8,
        title: "Task 8",
        description: "This is yet another test task",
      },
      {
        id: 9,
        title: "Task 9",
        description: "This is yet another test task",
      },
      {
        id: 10,
        title: "Task 10",
        description: "This is yet another test task",
      },
      {
        id: 11,
        title: "Task 11",
        description: "This is yet another test task",
      },
    ],
  },
  {
    id: 2,
    title: "In Progress",
    tasks: [
      {
        id: 1,
        title: "Task 1",
        description: "This is a test task",
      },
      {
        id: 2,
        title: "Task 2",
        description: "This is another test task",
      },
      {
        id: 3,
        title: "Task 3",
        description: "This is yet another test task",
      },
    ],
  },
  {
    id: 3,
    title: "Done",
    tasks: [
      {
        id: 1,
        title: "Task 1",
        description: "This is a test task",
      },
      {
        id: 2,
        title: "Task 2",
        description: "This is another test task",
      },
      {
        id: 3,
        title: "Task 3",
        description: "This is yet another test task",
      },
      {
        id: 4,
        title: "Task 4",
        description: "This is yet another test task",
      },
      {
        id: 5,
        title: "Task 5",
        description: "This is yet another test task",
      },
      {
        id: 6,
        title: "Task 6",
        description: "This is yet another test task",
      },
      {
        id: 7,
        title: "Task 7 ",
        description: "This is yet another test task",
      },
    ],
  },
  {
    id: 4,
    title: "Testing",
    tasks: [
      {
        id: 1,
        title: "Task 1",
        description: "This is a test task",
      },
      {
        id: 2,
        title: "Task 2",
        description: "This is another test task",
      },
    ],
  },
];

function TaskColumn() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [cards, setCards] = useState(COLUMN_DATA);

  const handleAddCard = (cardText: string) => {
    const newCard = {
      id: cards[0].tasks.length + 1,
      title: cardText,
      description: "",
    };

    const updatedCards = [...cards];
    updatedCards[0].tasks.push(newCard);

    setCards(updatedCards);
  };
  return (
    <Flex className={style.container}>
      {COLUMN_DATA.map((column) => (
        <Flex style={{ flexShrink: 0 }} key={column.id}>
          <Box>
            <Stack className={style.columnContainer}>
              <TextInput
                className={style.taskTitle}
                defaultValue={column.title}
              />
              <Stack className={style.taskContainer}>
                {column.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </Stack>
              <Stack
                // 為了因應tasks區塊的scroll bar空隙，所以margin要調整，後續可以重構
                style={{ marginLeft: 4, marginRight: 14, padding: "2px 4px" }}
              >
                <Button color="#4592af" onClick={() => setModalOpen(true)}>
                  + 新增卡片
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Flex>
      ))}
      <NewCardModal
        opened={isModalOpen}
        close={() => setModalOpen(false)}
        onAddCard={handleAddCard}
      />
    </Flex>
  );
}

export default TaskColumn;
