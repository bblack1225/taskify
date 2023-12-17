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
import { useMemo, useState } from "react";
import { IconDots, IconMoodCheck, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { delColumn, editColumn } from "@/api/column";
import { ColumnDeleteRes, ColumnResType, BaseDataRes } from "@/types/column";
import AddColumn from "./AddColumn";
import { notifications } from "@mantine/notifications";
import ColumnTitleTextarea from "./textarea/ColumnTitleTextarea";
import { useDisclosure } from "@mantine/hooks";
import TaskCardList from "./TaskCardList";
import { calculateDataIndex } from "@/utils";
import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/hooks/useUser";

function selectColumnsWithTasks(data: BaseDataRes): ColumnResType[] {
  return data.columns.map((column) => ({
    ...column,
    tasks: data.tasks.filter((task) => task.columnId === column.id),
  }));
}

function TaskColumn() {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentDelId, setCurrentDelId] = useState("");
  const userInfo = useUser();
  console.log('userInfo',userInfo);
  

  const { isPending, data, error } = useTasks(BOARD_ID);


  const columnsWithTasks = useMemo(() => {
    if (!data) {
      return [];
    }
    return selectColumnsWithTasks(data);
  }, [data]);

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (editTitle: { id: string; title: string }) =>
      editColumn(editTitle),
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          columns: oldData.columns.map((column) =>
            column.id !== updatedTask.id
              ? column
              : {
                  ...column,
                  title: updatedTask.title,
                }
          ),
        };
      });
      return { previousTasks };
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["tasks"] });
      notifications.show({
        icon: <IconMoodCheck />,
        message: "更新成功",
        autoClose: 2000,
      });
    },
    onError(_error, _variables, context) {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      close();
      return delColumn(id);
    },
    onSuccess: (resData: ColumnDeleteRes) => {
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          columns: oldData.columns.filter(
            (column) => column.id !== resData.deleteColId
          ),
        };
      });
      notifications.show({
        icon: <IconMoodCheck />,
        message: "刪除看板成功",
        autoClose: 2000,
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
  const currentColDataIndex = calculateDataIndex(columnsWithTasks);

  const handleEditTitle = (id: string, title: string) => {
    updateMutation.mutate({
      id,
      title,
    });
  };

  const handleDelColumn = () => {
    deleteMutation.mutate(currentDelId);
    setCurrentDelId("");
  };

  return (
    <Flex className={style.container}>
      {columnsWithTasks.map((column: ColumnResType) => (
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
      <AddColumn boardId={userInfo.boardId} currentColDataIndex={currentColDataIndex} />
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
        <Button color="red" onClick={handleDelColumn}>
          確定刪除
        </Button>
      </Modal>
    </Flex>
  );
}

export default TaskColumn;
