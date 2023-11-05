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
import { useState } from "react";
import { IconDots, IconMoodCheck, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { delColumns, editColumns, getAllColumns } from "@/api/column";
import {
  AllDataResType,
  ColumnDeleteRes,
  ColumnMutateRes,
  ColumnResType,
} from "@/types/column";
import AddColumn from "./AddColumn";
import { notifications } from "@mantine/notifications";
import ColumnTitleTextarea from "./textarea/ColumnTitleTextarea";
import { useDisclosure } from "@mantine/hooks";
import TaskCardList from "./TaskCardList";
import { calculateDataIndex } from "@/utils";

// 先寫死
const BOARD_ID = "296a0423-d062-43d7-ad2c-b5be1012af96";
// const BOARD_ID = "37d5162d-3aee-4e88-b9c4-4490a512031e";
// 假資料
// const sampleData: AllDataResType = {
//   boardId: "1",
//   title: "示例標題",
//   columns: [
//     {
//       id: "1",
//       title: "列1",
//       color: "紅色",
//       dataIndex: 0,
//       tasks: [
//         {
//           id: "1",
//           name: "任務1",
//           dataIndex: 0,
//           description: "這是任務1的描述",
//           labels: ["標籤1", "標籤2"],
//         },
//         {
//           id: "2",
//           name: "任務2",
//           dataIndex: 1,
//           description: "這是任務2的描述",
//           labels: ["標籤3"],
//         },
//         {
//           id: "3",
//           name: "任務2",
//           dataIndex: 1,
//           description: "這是任務2的描述",
//           labels: ["標籤3"],
//         },
//         {
//           id: "4",
//           name: "任務2",
//           dataIndex: 1,
//           description: "這是任務2的描述",
//           labels: ["標籤3"],
//         },
//         {
//           id: "5",
//           name: "任務2",
//           dataIndex: 1,
//           description: "這是任務2的描述",
//           labels: ["標籤3"],
//         },
//         {
//           id: "6",
//           name: "任務2",
//           dataIndex: 1,
//           description: "這是任務2的描述",
//           labels: ["標籤3"],
//         },
//       ],
//     },
//     {
//       id: "2",
//       title: "列2",
//       color: "藍色",
//       dataIndex: 1,
//       tasks: [
//         {
//           id: "3",
//           name: "任務3",
//           dataIndex: 0,
//           description: "這是任務3的描述",
//           labels: ["標籤4"],
//         },
//       ],
//     },
//     {
//       id: "3",
//       title: "列2",
//       color: "藍色",
//       dataIndex: 1,
//       tasks: [],
//     },
//   ],
// };

function TaskColumn() {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentDelId, setCurrentDelId] = useState("");
  const { isPending, data, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getAllColumns(BOARD_ID),
    // queryFn: () => {
    //   return sampleData;
    // },
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
        const newData = {
          ...oldData,
          columns: oldData.columns.filter(
            (column) => column.id !== resData.deleteColId
          ),
        };
        return newData;
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
  const currentColDataIndex = calculateDataIndex(data.columns);

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
              <TaskCardList column={column} />
            </Stack>
          </Box>
        </Flex>
      ))}
      <AddColumn boardId={BOARD_ID} currentColDataIndex={currentColDataIndex} />
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
