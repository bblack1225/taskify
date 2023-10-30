import {
  Box,
  Button,
  Flex,
  Stack,
  ActionIcon,
  Loader,
  Textarea,
} from "@mantine/core";
import style from "@/components/TaskColumn.module.scss";
import TaskCard from "./TaskCard";
import NewCardModal from "./NewCardModal";
import { useState } from "react";
import { IconDots } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editColumns, getAllColumns } from "@/api/column";
import {
  AllDataResType,
  ColumnMutateRes,
  ColumnResType,
  TasksResType,
} from "@/types/column";
import AddColumn from "./AddColumn";

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

// 先寫死
const BOARD_ID = "296a0423-d062-43d7-ad2c-b5be1012af96";
function TaskColumn() {
  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [cards, setCards] = useState(COLUMN_DATA);
  const [editTitle, setEditTitle] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const { isPending, data, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getAllColumns(BOARD_ID),
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (editTitle: { id: string; title: string }) =>
      editColumns(editTitle),
    onSuccess: (resData: ColumnMutateRes) => {
      queryClient.setQueryData(["task"], (oldData: AllDataResType) => {
        return {
          ...oldData,
          columns: oldData.columns.map((column) => {
            if (column.id !== resData.id) {
              return column;
            } else {
              return {
                ...column,
                title: resData.title,
              };
            }
          }),
        };
      });
    },
  });

  if (isPending)
    return (
      <div style={{ margin: "0 auto" }}>
        <Loader color="#4592af" type="dots" />
      </div>
    );

  if (error) return "An error has occurred: " + error.message;

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

  const handleEditTitle = (id: string, title: string) => {
    if (title === editTitle) return;
    mutate({
      id: id,
      title: editTitle,
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    title: string
  ) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      e.currentTarget.blur();
      if (title === editTitle) return;
    }
  };

  return (
    <Flex className={style.container}>
      {data.columns.map((column: ColumnResType) => (
        <Flex style={{ flexShrink: 0 }} key={column.id}>
          <Box>
            <Stack className={style.columnContainer}>
              <Flex className={style.titleContainer}>
                <Textarea
                  className={style.taskTitle}
                  defaultValue={column.title}
                  autosize
                  onKeyDown={(e) => handleKeyDown(e, column.title)}
                  onBlur={() => handleEditTitle(column.id, column.title)}
                  onFocus={() => setEditTitle(column.title)}
                  onChange={(e) => {
                    console.log("editTitle", editTitle);

                    setEditTitle(e.target.value);
                  }}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                />
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
              <Stack className={style.taskContainer}>
                {column.tasks.map((task: TasksResType) => (
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
      <AddColumn boardId={BOARD_ID} />

      <NewCardModal
        opened={isCardModalOpen}
        close={() => setCardModalOpen(false)}
        onAddCard={handleAddCard}
      />
    </Flex>
  );
}

export default TaskColumn;
