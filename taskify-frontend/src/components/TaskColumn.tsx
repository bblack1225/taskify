import {
  Box,
  Button,
  Flex,
  Stack,
  ActionIcon,
  Loader,
  Menu,
  Modal,
  Text,
  Group,
} from "@mantine/core";
import style from "@/components/TaskColumn.module.scss";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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

function selectColumnsWithTasks(data: BaseDataRes): ColumnResType[] {
  return data.columns.map((column) => ({
    ...column,
    tasks: data.tasks.filter((task) => task.columnId === column.id),
  }));
}

function TaskColumn() {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentDelId, setCurrentDelId] = useState("");
  const { boardId } = useParams<{ boardId: string }>();

  const { isPending, data, error } = useTasks(boardId || "");

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

  // find the last column's dataIndex
  const currentColDataIndex = calculateDataIndex(columnsWithTasks);

  const handleEditTitle = (id: string, title: string) => {
    updateMutation.mutate({
      id,
      title,
    });
  };

  const handleDeleteColumn = () => {
    if (currentDelId) {
      deleteMutation.mutate(currentDelId);
      close();
    }
  };

  if (isPending) {
    return (
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Loader color="#4592af" type="dots" />
      </Flex>
    );
  }

  if (error)
    return <Text color="red">An error has occurred: {error.message}</Text>;

  return (
    <Flex direction="column" gap="md" p="md">
      <Flex className={style.container}>
        {columnsWithTasks.map((column: ColumnResType) => (
          <Flex key={column.id} style={{ flexShrink: 0 }}>
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
                        aria-label="Column actions"
                        color="black"
                        size="xl"
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

        <AddColumn
          boardId={boardId || ""}
          currentColDataIndex={currentColDataIndex}
        />
      </Flex>

      <Modal
        opened={opened}
        onClose={close}
        title="確認刪除"
        centered
        radius={10}
      >
        <Text mb="md">確定要刪除此列表嗎？此操作無法復原。</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>
            取消
          </Button>
          <Button
            color="red"
            onClick={handleDeleteColumn}
            loading={deleteMutation.isPending}
          >
            刪除
          </Button>
        </Group>
      </Modal>
    </Flex>
  );
}

export default TaskColumn;
