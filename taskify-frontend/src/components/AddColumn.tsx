import { useEffect, useRef, useState } from "react";
import { ActionIcon, Box, Button, Flex, Stack, Textarea } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { IconMoodCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addColumn } from "@/api/column";
import { ColumnMutateRes, BaseDataRes } from "@/types/column";
import style from "./AddColumn.module.scss";
import { notifications } from "@mantine/notifications";
import { v4 as uuidv4 } from "uuid";
type Props = {
  boardId: string;
  currentColDataIndex: number;
};

function AddColumn({ boardId, currentColDataIndex }: Props) {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const ref = useClickOutside(() => {
    setNewTitle((prev) => prev.trim());
    setIsAddingColumn(false);
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (newColumn: {
      boardId: string;
      title: string;
      dataIndex: number;
    }) => addColumn(newColumn),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const optimisticColumn = {
        id: uuidv4(),
        title: variables.title,
        dataIndex: variables.dataIndex,
        tasks: [],
      };
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          columns: [...oldData.columns, optimisticColumn],
        };
      });
      return { optimisticColumn };
    },
    onSuccess: (resData: ColumnMutateRes, _variables, context) => {
      const newData = {
        id: resData.id,
        title: resData.title,
        tasks: [],
        dataIndex: resData.dataIndex,
      };
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          columns: oldData.columns.map((column) => {
            return column.id === context?.optimisticColumn.id
              ? newData
              : column;
          }),
        };
      });
      notifications.show({
        icon: <IconMoodCheck />,
        message: "新增看板成功",
        autoClose: 2000,
      });
      setNewTitle("");
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          columns: oldData.columns.filter(
            (column) => column.id !== context?.optimisticColumn.id
          ),
        };
      });
    },
    // 或許需要retry，目前先不給
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleAddColumn();
    }
  };

  const handleAddColumn = () => {
    setIsAddingColumn(false);
    const trimTitle = newTitle.trim();
    if (!trimTitle) {
      setNewTitle("");
      return;
    }
    mutate({
      boardId,
      title: trimTitle,
      dataIndex: currentColDataIndex,
    });
  };

  useEffect(() => {
    if (isAddingColumn && textareaRef.current) {
      const len = textareaRef.current.value.length;
      textareaRef.current.focus();
      textareaRef.current.selectionStart = len;
    }
  }, [isAddingColumn]);

  return (
    <Flex style={{ flexShrink: 0 }}>
      <Box>
        {isAddingColumn ? (
          <>
            <Stack className={style.columnContainer} ref={ref}>
              <Textarea
                ref={textareaRef}
                className={style.taskTitle}
                value={newTitle}
                autosize
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setNewTitle(e.target.value)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
              />
              <Flex style={{ padding: "0 4px" }}>
                <Button
                  className={style.addNewCardButton}
                  onClick={handleAddColumn}
                >
                  新增列表
                </Button>
                <ActionIcon
                  variant="transparent"
                  color="white"
                  aria-label="Close"
                  size={"lg"}
                  className={style.actionIcon}
                >
                  <IconX
                    onClick={() => {
                      setNewTitle("");
                      setIsAddingColumn(false);
                    }}
                  />
                </ActionIcon>
              </Flex>
            </Stack>
          </>
        ) : (
          <Stack className={style.columnContainer}>
            <Stack className={style.addButtonContainer}>
              <Button
                variant="subtle"
                color="orange"
                radius="md"
                onClick={() => {
                  setIsAddingColumn(true);
                }}
                className={style.addButton}
              >
                + 新增其他列表
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Flex>
  );
}

export default AddColumn;
