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
import { isActive } from "@tiptap/react";

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

  // drag over 只處理跨column的task移動
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeId = active.id;
    const overId = over?.id;

    const isActiveATask = active.data.current?.type === "Task";
    // 如果是column移動
    if (!over || !isActiveATask) {
      return;
    }
    // console.log("overId", overId);

    const activeColumnId = active.data.current?.task.columnId;
    const isOverAColumn = over.data.current?.type === "Column";
    const overColumnId = isOverAColumn
      ? overId
      : over.data.current?.task.columnId;
    if (!activeColumnId || !overColumnId) {
      return;
    }

    if (activeColumnId !== overColumnId) {
      setColumnsWithTasks(
        (prevColumnsWithTasks: ColumnResType[]): ColumnResType[] => {
          const activeTasks = prevColumnsWithTasks.find(
            (column) => column.id === activeColumnId
          )?.tasks;
          const overTasks = prevColumnsWithTasks.find(
            (column) => column.id === overColumnId
          )?.tasks;

          if (!activeTasks || !overTasks) return prevColumnsWithTasks;

          const overIndex = overTasks.findIndex((task) => task.id === overId);
          const activeIndex = activeTasks.findIndex(
            (task) => task.id === activeId
          );
          let newIndex: number;
          const overIdIndexByColumn = prevColumnsWithTasks.findIndex(
            (col) => col.id === overId
          );
          // console.log("overIdIndexByColumn", overIdIndexByColumn);

          // 代表移動到第一個或最後一個column，且元素為空
          if (overIdIndexByColumn !== -1) {
            newIndex = columnsWithTasks[overIdIndexByColumn].tasks.length + 1;
            // console.log("newIndex", newIndex);
          } else {
            // 移動到column最後一個元素
            const isBelowOverItem =
              over &&
              active.rect.current.translated &&
              active.rect.current.translated.top >
                over.rect.top + over.rect.height;

            const modifier = isBelowOverItem ? 1 : 0;
            newIndex =
              overIndex >= 0 ? overIndex + modifier : overTasks.length + 1;
          }
          return prevColumnsWithTasks.map((col) => {
            if (col.id === activeColumnId) {
              return {
                ...col,
                tasks: col.tasks.filter((task) => task.id !== activeId),
              };
            }
            if (col.id === overColumnId) {
              // task中的columnId要改成 overColumnId
              const draggedTask = {
                ...activeTasks[activeIndex],
                columnId: overColumnId,
              };
              const newOverTasks = [
                ...overTasks.slice(0, newIndex),
                draggedTask,
                ...overTasks.slice(newIndex, overTasks.length),
              ];
              return {
                ...col,
                tasks: newOverTasks,
              };
            }
            return col;
          });
        }
      );
    }
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    console.log("active", active);
    console.log("over", over);
    setActiveColumn(null);
    setActiveTask(null);

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (active.data.current?.type === "Column") {
      if (activeId === overId) {
        return;
      }

      const activeColumnIndex = columnsWithTasks.findIndex(
        (col) => col.id === activeId
      );
      const overColumnIndex = columnsWithTasks.findIndex(
        (col) => col.id === overId
      );
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
    } else {
      const overColumn = columnsWithTasks.find(
        (col) => col.id === over.data.current?.task.columnId
      );
      if (overColumn) {
        // TODO 處理task跨column移動
        if (activeId === overId) {
          console.log("處理task跨column移動");
        } else {
          const tasks = [...overColumn.tasks];
          const newTasks = arrayMove(
            tasks,
            active.data.current?.sortable.index,
            over.data.current?.sortable.index
          );
          console.log("tasks", tasks);
          console.log("newTasks", newTasks);

          setColumnsWithTasks((prevColumnsWithTasks) => {
            return prevColumnsWithTasks.map((col) => {
              if (col.id === overColumn.id) {
                return {
                  ...col,
                  tasks: newTasks,
                };
              }
              return col;
            });
          });
          console.log("處理task同column移動");
        }
      }
    }
    // console.log("處理task跨column移動");

    // if (activeId === overId) {
    //   // TODO 處理同一個column間的task移動，但column移動並沒有更換index也會進來這邊
    //   console.log("??????");
    //   return;
    // }

    // console.log("active.data.current?.type", active.data.current?.type);

    // // TODO 當為task時，要再儲存到後端
    // if (active.data.current?.type !== "Column") {
    //   // TODO 處理同一個column或不同column間的task移動，
    //   console.log("@@@@@@");
    //   return;
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
