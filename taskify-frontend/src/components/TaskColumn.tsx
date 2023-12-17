import {
  Button,
  Flex,
  Loader,
  LoadingOverlay,
  Modal,
  Stack,
} from "@mantine/core";
import styles from "@/components/TaskColumn.module.scss";
import { useEffect, useMemo, useState } from "react";
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
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import TaskColumnItem from "./TaskColumnItem";
import { createPortal } from "react-dom";

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
  const [activeColumn, setActiveColumn] = useState(null);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

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

  const columnsId = useMemo(
    () => columnsWithTasks.map((column) => column.id),
    [columnsWithTasks]
  );

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const sensors = useSensors(mouseSensor);
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
    console.log("eventSTART", event);

    const container = document.querySelector(`[data-id="${event.active.id}"]`);

    if (container) {
      setContainerSize({
        width: container.getBoundingClientRect().width,
        height: container.getBoundingClientRect().height,
        x: container.getBoundingClientRect().x,
        y: container.getBoundingClientRect().y,
      });
    }
    console.log("containerSize", containerSize);

    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current?.column);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // const { active, over } = event;
    // if (active.id !== over?.id) {
    //   console.log("active.id", active.id);
    //   console.log("over.id", over?.id);
    // }
  };
  const handleDragMove = (event: DragMoveEvent) => {
    console.log("event", event);

    // console.log("handleDragMove", event);
  };
  // console.log("columnsWithTasks", columnsWithTasks);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      <SortableContext items={columnsId}>
        <Flex className={styles.container}>
          {columnsWithTasks.map((column: ColumnResType) => (
            <TaskColumnItem
              clientHeight={containerSize.height}
              clientWidth={containerSize.width}
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
      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <Flex className={styles.container}>
              <TaskColumnItem column={activeColumn} />
            </Flex>
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

export default TaskColumn;
