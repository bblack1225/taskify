import {
  Box,
  Button,
  Flex,
  Stack,
  ActionIcon,
  Menu,
  Modal,
  Text,
  Group,
  Skeleton,
} from "@mantine/core";
import style from "@/components/TaskColumn.module.scss";
import { useEffect, useMemo, useState } from "react";
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
import TBstyle from "@/pages/Taskboard.module.scss";

function selectColumnsWithTasks(data: BaseDataRes): ColumnResType[] {
  return data.columns.map((column) => ({
    ...column,
    tasks: data.tasks.filter((task) => task.columnId === column.id),
  }));
}

function TaskColumn() {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentDelId, setCurrentDelId] = useState("");
  const [animationPhase, setAnimationPhase] = useState(0);
  const { boardId } = useParams<{ boardId: string }>();

  const { isPending, data, error } = useTasks(boardId || "");

  // 切換動畫階段
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 3);
    }, 500); // 每0.5秒切換一次
    return () => clearInterval(timer);
  }, []);

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

  if (error) return <Text>An error has occurred: {error.message}</Text>;

  return (
    <Flex
      direction="column"
      gap="md"
      pt={24}
      style={{
        borderTop: "1px solid #CCC",
        width: "fit-content",
        paddingRight: "24px",
      }}
    >
      <Flex className={style.container}>
        {isPending ? (
          <Stack w={"2000px"} h="100vh" style={{ overflow: "auto hidden" }}>
            <Flex
              className={TBstyle.container}
              justify="space-between"
              align="center"
            >
              <Skeleton height={28} width={200} radius="sm" />
              <Skeleton height={36} width={120} radius="md" />
            </Flex>
            <Flex gap="md" p="md">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: "300px",
                    height:
                      index === animationPhase
                        ? "400px"
                        : index === animationPhase + 1
                        ? "300px"
                        : "200px",
                    background: "rgba(0, 0, 0, 0.03)",
                    borderRadius: "8px",
                    transition: "all 0.5s ease-in-out",
                    opacity: 0.8,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      height: "30px",
                      width: "60%",
                      background: "rgba(0, 0, 0, 0.05)",
                      margin: "10px",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              ))}
            </Flex>
          </Stack>
        ) : (
          <>
            {columnsWithTasks.map((column: ColumnResType) => (
              <Flex
                key={column.id}
                style={{
                  flexShrink: 0,
                  height: "600px",
                }}
              >
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

            {data && (
              <AddColumn
                boardId={boardId || ""}
                currentColDataIndex={currentColDataIndex}
              />
            )}
          </>
        )}
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
