import {
  Box,
  Button,
  Flex,
  Stack,
  TextInput,
  ActionIcon,
  Loader,
} from "@mantine/core";
import style from "@/components/TaskColumn.module.scss";
import TaskCard from "./TaskCard";
import NewCardModal from "./NewCardModal";
import { useState } from "react";
import { IconDotsVertical } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { fetchBoardData } from "@/api/fetchBoardData";
import NewBoardModal from "./NewBoardModal";
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
  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [isBoardModalOpen, setBoardModalOpen] = useState(false);
  const [cards, setCards] = useState(COLUMN_DATA);
  const { isPending, data, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchBoardData("296a0423-d062-43d7-ad2c-b5be1012af96"),
  });

  if (isPending)
    return (
      <div style={{ margin: "0 auto" }}>
        <Loader color="#4592af" type="dots" />
      </div>
    );

  if (error) return "An error has occurred: " + error.message;
  console.log("data", data);

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

  const handleAddBoard = (cardText: string) => {
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
              <Flex className={style.titleContainer}>
                <TextInput
                  className={style.taskTitle}
                  defaultValue={column.title}
                />
                <ActionIcon
                  className={style.actionIcon}
                  variant="transparent"
                  aria-label="Settings"
                  color="white"
                  size={"lg"}
                >
                  <IconDotsVertical size="1.125rem" />
                </ActionIcon>
              </Flex>
              <Stack className={style.taskContainer}>
                {column.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </Stack>
              <Stack className={style.addButtonContainer}>
                <Button color="#4592af" onClick={() => setCardModalOpen(true)}>
                  + 新增卡片
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Flex>
      ))}
      <Flex style={{ flexShrink: 0 }}>
        <Box>
          <Stack className={style.columnContainer}>
            <Stack className={style.addButtonContainer}>
              <Button color="#4592af" onClick={() => setBoardModalOpen(true)}>
                + 新增其他列表
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Flex>
      <NewCardModal
        opened={isCardModalOpen}
        close={() => setCardModalOpen(false)}
        onAddCard={handleAddCard}
      />
      <NewBoardModal
        opened={isBoardModalOpen}
        close={() => setBoardModalOpen(false)}
        onAddBoard={handleAddBoard}
      />
    </Flex>
  );
}

export default TaskColumn;
