import {
  Box,
  Button,
  Flex,
  Stack,
  ActionIcon,
  Loader,
  Textarea,
} from "@mantine/core"
import style from "@/components/TaskColumn.module.scss"
import TaskCard from "./TaskCard"
import NewCardModal from "./NewCardModal"
import { useState } from "react"
import { IconDots, IconX } from "@tabler/icons-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchBoardData } from "@/api/fetchBoardData"
import NewBoardModal from "./NewBoardModal"
import { useClickOutside } from "@mantine/hooks"
import { addColumns } from "@/api/column"
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
]
const BOARD_ID = "296a0423-d062-43d7-ad2c-b5be1012af96"
export type AllDataResType = {
  boardId: string
  title: string
  columns: ColumnResType[]
}

type ColumnResType = {
  id: string
  title: string
  color: string
  dataIndex: number
  tasks: TasksResType[]
}

type TasksResType = {
  id: string
  name: string
  dataIndex: number
  description: string
  labels: string[]
}
function TaskColumn() {
  const [isCardModalOpen, setCardModalOpen] = useState(false)
  const [isBoardModalOpen, setBoardModalOpen] = useState(false)
  const [cards, setCards] = useState(COLUMN_DATA)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const queryClient = useQueryClient()
  const ref = useClickOutside(() => setIsAddingColumn(false))

  const { isPending, data, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchBoardData("296a0423-d062-43d7-ad2c-b5be1012af96"),
  })

  const { mutate } = useMutation({
    mutationFn: async (newTask: {
      boardId: string
      title: string
      dataIndex: number
    }) => {
      const { data } = await addColumns(newTask)
      return data
    },
    onSuccess: (resData) => {
      const newData = { id: resData.id, title: resData.title, tasks: [] }
      queryClient.setQueryData(["tasks"], (oldData: AllDataResType) => {
        return {
          ...oldData,
          columns: [...oldData.columns, newData],
        }
      })
    },
  })

  if (isPending)
    return (
      <div style={{ margin: "0 auto" }}>
        <Loader color="#4592af" type="dots" />
      </div>
    )

  if (error) return "An error has occurred: " + error.message

  const handleAddCard = (cardText: string) => {
    const newCard = {
      id: cards[0].tasks.length + 1,
      title: cardText,
      description: "",
    }

    const updatedCards = [...cards]
    updatedCards[0].tasks.push(newCard)

    setCards(updatedCards)
  }

  const handleAddBoard = (cardText: string) => {
    const newCard = {
      id: cards[0].tasks.length + 1,
      title: cardText,
      description: "",
    }

    const updatedCards = [...cards]
    updatedCards[0].tasks.push(newCard)

    setCards(updatedCards)
  }

  const handleAddColumn = () => {
    setIsAddingColumn(false)
    setNewColumnTitle("")
    mutate({
      boardId: BOARD_ID,
      title: newColumnTitle,
      dataIndex: data.columns.length + 1,
    })
  }

  return (
    <Flex className={style.container}>
      {data.columns.map((column: ColumnResType) => (
        <Flex style={{ flexShrink: 0 }} key={column.id}>
          <Box>
            <Stack className={style.columnContainer}>
              <Flex className={style.titleContainer}>
                <Textarea
                  className={style.taskTitle}
                  value={column.title}
                  autosize
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
      {isAddingColumn ? (
        <Flex style={{ flexShrink: 0 }}>
          <Box>
            <Stack className={style.columnContainer} ref={ref}>
              <Textarea
                autoFocus
                placeholder="為列表輸入標題"
                autosize
                onChange={(e) => setNewColumnTitle(e.target.value)}
                style={{ margin: "0 4px" }}
              />
              <Flex style={{ padding: "0 4px" }}>
                <Button onClick={handleAddColumn}>新增列表</Button>
                <ActionIcon
                  variant="transparent"
                  color="white"
                  aria-label="Close"
                  size={"lg"}
                  className={style.actionIcon}
                >
                  <IconX onClick={() => setIsAddingColumn(false)} />
                </ActionIcon>
              </Flex>
            </Stack>
          </Box>
        </Flex>
      ) : (
        <Flex style={{ flexShrink: 0 }}>
          <Box>
            <Stack className={style.columnContainer}>
              <Stack className={style.addButtonContainer}>
                <Button color="#4592af" onClick={() => setIsAddingColumn(true)}>
                  + 新增其他列表
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Flex>
      )}
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
  )
}

export default TaskColumn
