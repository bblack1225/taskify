import {
  Box,
  Button,
  Flex,
  Stack,
  ActionIcon,
  Loader,
  Menu,
  Modal,
} from "@mantine/core";
import style from "@/components/TaskColumn.module.scss";
import TaskCard from "./TaskCard";
// import NewCardModal from "./NewCardModal";
import { useState } from "react";
import { IconDots, IconMoodCheck, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { delColumns, editColumns, getAllColumns } from "@/api/column";
import {
  AllDataResType,
  ColumnDeleteRes,
  ColumnMutateRes,
  ColumnResType,
  TasksResType,
} from "@/types/column";
import AddColumn from "./AddColumn";
import { notifications } from "@mantine/notifications";
import ColumnTitleTextarea from "./textarea/ColumnTitleTextarea";
import { useDisclosure } from "@mantine/hooks";
import AddTask from "./AddTask";

// const COLUMN_DATA = [
//   {
//     id: 1,
//     title: "To Do",
//     tasks: [
//       {
//         id: 1,
//         title: "Task 1",
//         description: "This is a test task",
//       },
//       {
//         id: 2,
//         title: "Task 2",
//         description: "This is another test task",
//       },
//       {
//         id: 3,
//         title: "Task 3",
//         description: "This is yet another test task",
//       },
//       {
//         id: 4,
//         title: "Task 4",
//         description: "This is yet another test task",
//       },
//       {
//         id: 5,
//         title: "Task 5",
//         description: "This is yet another test task",
//       },
//       {
//         id: 6,
//         title: "Task 6",
//         description: "This is yet another test task",
//       },
//       {
//         id: 7,
//         title: "Task 7",
//         description: "This is yet another test task",
//       },
//       {
//         id: 8,
//         title: "Task 8",
//         description: "This is yet another test task",
//       },
//       {
//         id: 9,
//         title: "Task 9",
//         description: "This is yet another test task",
//       },
//       {
//         id: 10,
//         title: "Task 10",
//         description: "This is yet another test task",
//       },
//       {
//         id: 11,
//         title: "Task 11",
//         description: "This is yet another test task",
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "In Progress",
//     tasks: [
//       {
//         id: 1,
//         title: "Task 1",
//         description: "This is a test task",
//       },
//       {
//         id: 2,
//         title: "Task 2",
//         description: "This is another test task",
//       },
//       {
//         id: 3,
//         title: "Task 3",
//         description: "This is yet another test task",
//       },
//     ],
//   },
//   {
//     id: 3,
//     title: "Done",
//     tasks: [
//       {
//         id: 1,
//         title: "Task 1",
//         description: "This is a test task",
//       },
//       {
//         id: 2,
//         title: "Task 2",
//         description: "This is another test task",
//       },
//       {
//         id: 3,
//         title: "Task 3",
//         description: "This is yet another test task",
//       },
//       {
//         id: 4,
//         title: "Task 4",
//         description: "This is yet another test task",
//       },
//       {
//         id: 5,
//         title: "Task 5",
//         description: "This is yet another test task",
//       },
//       {
//         id: 6,
//         title: "Task 6",
//         description: "This is yet another test task",
//       },
//       {
//         id: 7,
//         title: "Task 7 ",
//         description: "This is yet another test task",
//       },
//     ],
//   },
//   {
//     id: 4,
//     title: "Testing",
//     tasks: [
//       {
//         id: 1,
//         title: "Task 1",
//         description: "This is a test task",
//       },
//       {
//         id: 2,
//         title: "Task 2",
//         description: "This is another test task",
//       },
//     ],
//   },
// ];

// 先寫死
const BOARD_ID = "296a0423-d062-43d7-ad2c-b5be1012af96";
function TaskColumn() {
  // const [isCardModalOpen, setCardModalOpen] = useState(false);
  // const [cards, setCards] = useState(COLUMN_DATA);
  const [opened, { open, close }] = useDisclosure(false);
  const [currentDelId, setCurrentDelId] = useState("");
  const { isPending, data, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getAllColumns(BOARD_ID),
  });

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (editTitle: { id: string; title: string }) =>
      editColumns(editTitle),
    onSuccess: (resData: ColumnMutateRes) => {
      console.log("data", data);

      notifications.show({
        icon: <IconMoodCheck />,
        message: "更新成功",
        autoClose: 2000,
      });
      queryClient.setQueryData(["tasks"], (oldData: AllDataResType) => {
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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      close();
      return delColumns(id);
    },
    onSuccess: (resData: ColumnDeleteRes) => {
      notifications.show({
        icon: <IconMoodCheck />,
        message: "刪除看板成功",
        autoClose: 2000,
      });
      queryClient.setQueryData(["tasks"], (oldData: AllDataResType) => {
        return {
          ...oldData,
          columns: oldData.columns.filter(
            (column) => column.id !== resData.deleteColId
          ),
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

  // find the last column's dataIndex
  const currentColDataIndex =
    data.columns[data.columns.length - 1]?.dataIndex || 0;

  // const handleAddCard = (cardText: string) => {
  //   const newCard = {
  //     id: cards[0].tasks.length + 1,
  //     title: cardText,
  //     description: "",
  //   };

  //   const updatedCards = [...cards];
  //   updatedCards[0].tasks.push(newCard);

  //   setCards(updatedCards);
  // };

  const handleEditTitle = (id: string, title: string) => {
    updateMutation.mutate({
      id,
      title,
    });
  };

  const handleDelColumn = (id: string) => {
    deleteMutation.mutate(id);
    setCurrentDelId("");
  };

  return (
    <Flex className={style.container}>
      {data.columns.map((column: ColumnResType) => (
        <Flex style={{ flexShrink: 0 }} key={column.id}>
          <Box>
            <Stack className={style.columnContainer}>
              <Flex className={style.titleContainer}>
                <ColumnTitleTextarea
                  id={column.id}
                  title={column.title}
                  onSave={handleEditTitle}
                />
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon
                      className={style.actionIcon}
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
              <Stack className={style.taskContainer}>
                {column.tasks.map((task: TasksResType) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </Stack>
              <AddTask />
            </Stack>
          </Box>
        </Flex>
      ))}
      <AddColumn boardId={BOARD_ID} currentColDataIndex={currentColDataIndex} />
      {/* 先保留 */}
      {/* <NewCardModal
        opened={isCardModalOpen}
        close={() => setCardModalOpen(false)}
      /> */}
      <Modal
        opened={opened}
        onClose={close}
        radius={10}
        size="xs"
        title="請問確定要刪除此列表嗎？"
        overlayProps={{
          backgroundOpacity: 0.1,
          blur: 2,
        }}
      >
        <Button color="red" onClick={() => handleDelColumn(currentDelId)}>
          確定刪除
        </Button>
      </Modal>
    </Flex>
  );
}

export default TaskColumn;
