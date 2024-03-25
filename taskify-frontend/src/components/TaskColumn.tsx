import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Loader,
  Modal,
  Stack,
} from "@mantine/core";
import style from "@/components/TaskColumn.module.scss";
import { useEffect, useState } from "react";
import { IconDots, IconMoodCheck } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { delColumn, editColumn } from "@/api/column";
import { ColumnDeleteRes, ColumnResType, BaseDataRes } from "@/types/column";
import AddColumn from "./AddColumn";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import TaskCardList from "./TaskCardList";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import DroppableContainer from "./DroppableContainer";
import ColumnTitleTextarea from "./textarea/ColumnTitleTextarea";

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
  const [activeItemId, setActiveItemId] = useState<null | string>(null);

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
  const [containers, setContainers] = useState<string[]>([]);
  const [taskItems, setTaskItems] = useState<Record<string, ColumnResType>>({});

  useEffect(() => {
    if (!data) {
      return;
    }
    const columnsWithTasks = selectColumnsWithTasks(data);
    setColumnsWithTasks(columnsWithTasks);
    const containers = data.columns.map((col) => col.id);
    setContainers(containers);
    const taskItems = containers.reduce((obj, key) => {
      return {
        ...obj,
        [key]: columnsWithTasks.find((col) => col.id === key),
      };
    }, {});
    setTaskItems(taskItems);
  }, [data]);

  // const columnsWithTasks = useMemo(() => {
  //   if (!data) {
  //     return [];
  //   }
  //   return selectColumnsWithTasks(data);
  // }, [data]);

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

  const handleDragStart = ({ active }: DragStartEvent) => {
    console.log("active", active.id);

    setActiveItemId(active.id as string);
  };

  const task = activeItemId
    ? data?.tasks.find((task) => task.id === activeItemId)
    : null;

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
    console.log("activeId", activeId);
    console.log("overId", overId);

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
    // console.log("active", active);
    // console.log("over", over);

    const activeContainer = active.data.current?.containerId;
    const overContainer = over?.data.current?.sortable.containerId;
    //over的containerId
    // const activeId = task?.id;

    if (!activeContainer || !overContainer) {
      return;
    }
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

  const renderColumnOverlay = (column: ColumnResType) => {
    return (
      <div style={{ flexShrink: 0, display: "flex", height: "100%" }}>
        <Flex style={{ height: "100%" }}>
          <Box
            style={{
              height: "100%",
            }}
          >
            <Stack className={style.columnContainer}>
              <Flex className={style.titleContainer}>
                <ColumnTitleTextarea
                  id={column.id}
                  title={column.title}
                  onSave={handleEditTitle}
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
              <TaskCardList
                columnId={column.id}
                tasks={taskItems[column.id].tasks}
              />
            </Stack>
          </Box>
        </Flex>
      </div>
    );
  };
  return (
    <Flex className={style.container}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={containers}
          strategy={verticalListSortingStrategy}
        >
          {/* {columnsWithTasks.map((column: ColumnResType) => ( */}
          {containers.map((containerId) => (
            <DroppableContainer
              items={taskItems[containerId].tasks.map((task) => task.id)}
              key={containerId}
              id={containerId}
              title={taskItems[containerId].title}
              onDelMenuOpen={() => handleOpenDelMenu(containerId)}
              onTitleSave={handleEditTitle}
            >
              <TaskCardList
                columnId={containerId}
                tasks={taskItems[containerId].tasks}
              />
            </DroppableContainer>
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
        <DragOverlay dropAnimation={dropAnimation}>
          {activeItemId ? (
            containers.includes(activeItemId) ? (
              renderColumnOverlay(taskItems[activeItemId])
            ) : (
              <TaskCard task={task} open={open} close={close} opened={opened} />
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </Flex>
  );
}

export default TaskColumn;
