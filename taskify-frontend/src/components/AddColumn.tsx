import { useEffect, useRef, useState } from "react";
import { ActionIcon, Box, Button, Flex, Stack, Textarea } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { IconMoodCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addColumn } from "@/api/column";
import { ColumnMutateRes, AllDataResType } from "@/types/column";
import style from "./AddColumn.module.scss";
import { notifications } from "@mantine/notifications";

type Props = {
  boardId: string;
  currentColDataIndex: number;
};
// TODO style 是共用的，尚未拆分
function AddColumn({ boardId, currentColDataIndex }: Props) {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newTitle, setNewTitle] = useState("");
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
    onSuccess: (resData: ColumnMutateRes) => {
      const newData = {
        id: resData.id,
        title: resData.title,
        tasks: [],
        dataIndex: resData.dataIndex,
      };
      queryClient.setQueryData(["tasks"], (oldData: AllDataResType) => {
        return {
          ...oldData,
          columns: [...oldData.columns, newData],
        };
      });
      notifications.show({
        icon: <IconMoodCheck />,
        message: "新增看板成功",
        autoClose: 2000,
      });
      setNewTitle("");
    },
  });

  const [isComposing, setIsComposing] = useState(false);

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
                color="#4592af"
                onClick={() => {
                  setIsAddingColumn(true);
                }}
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
