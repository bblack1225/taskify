import { Button, Flex, Loader, Modal, Stack } from "@mantine/core";
import styles from "@/components/TaskColumn.module.scss";
import { useMemo, useState } from "react";
import { IconMoodCheck } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { delColumn, editColumn, getBaseData } from "@/api/column";
import { ColumnDeleteRes, ColumnResType, BaseDataRes } from "@/types/column";
import AddColumn from "./AddColumn";
import { notifications } from "@mantine/notifications";

import { useDisclosure } from "@mantine/hooks";

import { calculateDataIndex } from "@/utils";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import TaskColumnItem from "./TaskColumnItem";

// 先寫死
const BOARD_ID = "296a0423-d062-43d7-ad2c-b5be1012af96";
// const BOARD_ID = "37d5162d-3aee-4e88-b9c4-4490a512031e";

function selectColumnsWithTasks(data: BaseDataRes): ColumnResType[] {
  return data.columns.map((column) => ({
    ...column,
    tasks: data.tasks.filter((task) => task.columnId === column.id),
  }));
}

function TaskColumn() {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentDelId, setCurrentDelId] = useState("");
  const [activeColumnItem, setActiveColumnItem] =
    useState<ColumnResType | null>(null);

  const { isPending, data, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getBaseData(BOARD_ID),
  });

  const columnsWithTasks = useMemo(() => {
    if (!data) {
      return [];
    }
    return selectColumnsWithTasks(data);
  }, [data]);

  const columnsWithTasksId = useMemo(
    () => columnsWithTasks.map((column) => column.id),
    [columnsWithTasks]
  );
  console.log("columnsWithTasksId", columnsWithTasksId);

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

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.id) {
      setActiveColumnItem(event.active.data.current?.id);
    }
    console.log("handleDragStart", event);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    console.log("handleDragEnd", event);
  };
  const handleDragMove = (event: DragMoveEvent) => {
    console.log("handleDragMove", event);
  };
  console.log("columnsWithTasks", columnsWithTasks);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      <DragOverlay>
        {activeColumnItem && (
          <Stack
            style={{ border: "1px solid pink" }}
            className={styles.columnContainer}
          >
            12
          </Stack>
        )}
      </DragOverlay>
      <SortableContext items={columnsWithTasks.map((column) => column.id)}>
        <Flex className={styles.container}>
          {columnsWithTasks.map((column: ColumnResType) => (
            <TaskColumnItem
              open={open}
              key={column.id}
              handleEditTitle={handleEditTitle}
              setCurrentDelId={setCurrentDelId}
              column={column}
            />
          ))}

          <AddColumn
            boardId={BOARD_ID}
            currentColDataIndex={currentColDataIndex}
          />
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
      </SortableContext>
    </DndContext>
  );
}

export default TaskColumn;
