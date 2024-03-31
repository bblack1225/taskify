import { Button, Flex, Loader, Modal } from "@mantine/core";
import style from "@/components/TaskColumn.module.scss";
import { useEffect, useState } from "react";
import { IconMoodCheck } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { delColumn, editColumn } from "@/api/column";
import {
  ColumnDeleteRes,
  ColumnResType,
  BaseDataRes,
  BaseTaskRes,
} from "@/types/column";
import AddColumn from "./AddColumn";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { calculateDataIndex } from "@/utils";
import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/hooks/useUser";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  defaultDropAnimation,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import ColumnContainer from "./ColumnContainer";
import ColumnContainerOverlay from "./ColumnContainerOverlay";
import { createPortal } from "react-dom";

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
  const [activeColumn, setActiveColumn] = useState<ColumnResType | null>(null);
  const [activeTask, setActiveTask] = useState<BaseTaskRes | null>(null);

  const { isPending, data, error } = useTasks(userInfo.boardId);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);
  const [columnsWithTasks, setColumnsWithTasks] = useState<
    Array<ColumnResType>
  >([]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const columnsWithTasks = selectColumnsWithTasks(data);
    setColumnsWithTasks(columnsWithTasks);
  }, [data]);

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (updatedColumn: {
      id: string;
      title: string;
      dataIndex: number;
      wholeUpdatedColumns?: ColumnResType[];
    }) => editColumn(updatedColumn),
    onMutate: async (updatedColumn) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      if (updatedColumn.wholeUpdatedColumns) {
        queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
          return {
            ...oldData,
            columns: updatedColumn.wholeUpdatedColumns,
          };
        });
      } else {
        queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
          return {
            ...oldData,
            columns: oldData.columns.map((column) =>
              column.id !== updatedColumn.id
                ? column
                : {
                    ...column,
                    title: updatedColumn.title,
                  }
            ),
          };
        });
      }
      return { previousTasks };
    },
    onSuccess: (data) => {
      if (data.columnIndexMap) {
        const { columnIndexMap } = data;
        console.log("updatedColumn", columnIndexMap);

        queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
          const newColumns = oldData.columns.map((column) => {
            const newDataIndex = columnIndexMap[column.id];
            return {
              ...column,
              dataIndex: newDataIndex,
            };
          });
          console.log("newColumns", newColumns);

          return {
            ...oldData,
            columns: newColumns,
          };
        });
      }

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

  if (isPending) {
    return (
      <div style={{ margin: "0 auto" }}>
        <Loader color="#4592af" type="dots" />
      </div>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  // find the last column's dataIndex
  const currentColDataIndex = calculateDataIndex(columnsWithTasks);

  const handleEditTitle = (id: string, title: string) => {
    const column = columnsWithTasks.find((col) => col.id === id);
    if (column) {
      updateMutation.mutate({
        id,
        title,
        dataIndex: column.dataIndex,
      });
    } else {
      notifications.show({
        title: "Error!",
        message: "Column not found!",
        color: "red",
      });
    }
  };

  const handleDelColumn = () => {
    deleteMutation.mutate(currentDelId);
    setCurrentDelId("");
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (active.data.current?.type === "Column") {
      setActiveColumn(active.data.current?.column);
      return;
    }

    if (active.data.current?.type === "Task") {
      setActiveTask(active.data.current?.task);
      return;
    }

    // setActiveItemId(active.id as string);
  };

  const findContainerId = (id: string, columnsWithTasks: ColumnResType[]) => {
    const index = columnsWithTasks.findIndex((col) => col.id === id);
    if (index == -1) {
      return id;
    }
    return columnsWithTasks[index].id;
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeId = active.id;
    const overId = over?.id;
    const activeContainerId = findContainerId(
      activeId as string,
      columnsWithTasks
    );
    const overContainerId = findContainerId(overId as string, columnsWithTasks);
    // console.log("activeId", activeId);
    // console.log("overId", overId);

    if (
      !activeContainerId ||
      !overContainerId ||
      overContainerId === activeContainerId
    ) {
      return;
    }

    // setColumnsWithTasks(
    //   (prevColumnsWithTasks: ColumnResType[]): ColumnResType[] => {
    //     console.log("prevColumnsWithTasks", prevColumnsWithTasks);

    //     const activeTasks = prevColumnsWithTasks.find(
    //       (col) => col.id === activeContainerId
    //     )?.tasks;
    //     const overTasks = prevColumnsWithTasks.find(
    //       (col) => col.id === overContainerId
    //     )?.tasks;

    //     const activeTaskIndex = activeTasks?.findIndex(
    //       (task) => task.id === activeId
    //     );
    //     const overTaskIndex = overTasks?.findIndex(
    //       (task) => task.id === overId
    //     );
    //     const currentTask = activeTasks?.find((task) => task.id === activeId);
    //     console.log("activeTasks", activeTasks);
    //     console.log("activeTaskIndex", activeTaskIndex);

    //     const newVal = prevColumnsWithTasks.map((col) => {
    //       if (col.id === activeContainerId) {
    //         const newTasks = col.tasks.filter((task) => task.id !== activeId);
    //         return {
    //           ...col,
    //           tasks: newTasks,
    //         };
    //       }
    //       if (col.id === overContainerId) {
    //         const newTasks = [
    //           ...col.tasks.slice(0, overTaskIndex),
    //           currentTask,
    //           ...col.tasks.slice(overTaskIndex, col.tasks.length),
    //         ];
    //         return {
    //           ...col,
    //           tasks: newTasks,
    //         };
    //       }

    //       return col;
    //     });

    //     return newVal as ColumnResType[];
    //   }
    // );
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) {
      return;
    }

    console.log("active.data.current?.type", active.data.current?.type);

    // TODO 當為task時，要再儲存到後端
    if (active.data.current?.type !== "Column") {
      return;
    }

    const activeColumnIndex = columnsWithTasks.findIndex(
      (col) => col.id === activeId
    );
    const overColumnIndex = columnsWithTasks.findIndex(
      (col) => col.id === overId
    );
    console.log("activeColumnIndex", activeColumnIndex);
    console.log("overColumnIndex", overColumnIndex);
    const currentColumn = columnsWithTasks[activeColumnIndex];
    let newDataIndex: number;
    if (overColumnIndex === 0) {
      // 移到第一個
      newDataIndex = columnsWithTasks[0].dataIndex / 2;
    } else if (overColumnIndex === columnsWithTasks.length - 1) {
      // 移到最後一個
      newDataIndex = columnsWithTasks[overColumnIndex].dataIndex + 65536;
    } else {
      // 移到中間

      // 往右移
      if (overColumnIndex > activeColumnIndex) {
        newDataIndex =
          (columnsWithTasks[overColumnIndex].dataIndex +
            columnsWithTasks[overColumnIndex + 1].dataIndex) /
          2;
      } else {
        // 往左移
        newDataIndex =
          (columnsWithTasks[overColumnIndex - 1].dataIndex +
            columnsWithTasks[overColumnIndex].dataIndex) /
          2;
      }
    }

    const updatedColumn = {
      ...currentColumn,
      dataIndex: newDataIndex,
    };
    const updatedColumns = columnsWithTasks.map((col) => {
      if (col.id === currentColumn.id) {
        return updatedColumn;
      }
      return col;
    });

    const columnsAfterMove = arrayMove(
      updatedColumns,
      activeColumnIndex,
      overColumnIndex
    );
    setColumnsWithTasks(columnsAfterMove);

    updateMutation.mutate({
      id: currentColumn.id,
      title: currentColumn.title,
      dataIndex: newDataIndex,
      wholeUpdatedColumns: columnsAfterMove,
    });

    // setColumnsWithTasks(columnsAfterMove);
    // console.log("currentOverColumn", currentOverColumn);

    // // update column
    // setColumnsWithTasks((prevColumns: ColumnResType[]): ColumnResType[] => {
    //   return arrayMove(prevColumns, activeColumnIndex, overColumnIndex);
    // });

    // const activeContainer = active.data.current?.containerId;
    // const overContainer = over?.data.current?.sortable.containerId;
    //over的containerId
    // const activeId = task?.id;

    // if (!activeContainer || !overContainer) {
    // return;
    // }
    // active的taskId;

    // if (activeContainer) {
    //   columnsWithTasks.forEach((col) => {
    //     col.tasks.forEach((colTask, taskIndex) => {
    //       if (colTask.id !== activeId) {
    //         return;
    //       } else if (colTask.id === activeId) {
    //         col.tasks.splice(taskIndex, 1);
    //         columnsWithTasks.find((col) => {
    //           if (col.id === overContainer) {
    //             const overInner = over?.data.current?.sortable.items;
    //             col.tasks.splice(overInner.indexOf(activeId), 0, colTask);
    //           }
    //         });
    //       }
    //     });
    //   });
    // }

    // const sourceColumn = columnsWithTasks.find(
    //   (col) => col.id === activeContainer
    // );
    // // console.log("sourceColumn", sourceColumn);

    // const targetColumn = columnsWithTasks.find(
    //   (col) => col.id === overContainer
    // );
    // // console.log("targetColumn", targetColumn);

    // if (sourceColumn && targetColumn) {
    //   const taskToMove = sourceColumn.tasks.find(
    //     (task) => task.id === activeId
    //   );
    //   sourceColumn.tasks.splice(sourceColumn.tasks.indexOf(taskToMove), 1);
    //   targetColumn.tasks.splice(0, 0, taskToMove);
    // }

    // if (activeContainer) {
    //   queryClient.invalidateQueries({ queryKey: ["tasks"] });
    // }
  };

  const handleOpenDelMenu = (containerId: string) => {
    open();
    setCurrentDelId(containerId);
  };
  console.log("columnsWithTasks", columnsWithTasks);

  return (
    <Flex className={style.container}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={columnsWithTasks.map((column) => column.id)}>
          {columnsWithTasks.map((column: ColumnResType) => (
            <ColumnContainer
              key={column.id}
              column={column}
              handleEditTitle={handleEditTitle}
              onDelMenuOpen={handleOpenDelMenu}
            />
          ))}
        </SortableContext>
        <AddColumn
          boardId={userInfo.boardId}
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
        {createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeColumn && <ColumnContainerOverlay column={activeColumn} />}
            {activeTask && (
              <TaskCard
                task={activeTask}
                open={open}
                opened={opened}
                close={close}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </Flex>
  );
}

export default TaskColumn;
