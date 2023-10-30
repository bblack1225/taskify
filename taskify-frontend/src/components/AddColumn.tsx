import { useState } from "react";
import { ActionIcon, Box, Button, Flex, Stack, Textarea } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addColumns } from "@/api/column";
import { ColumnMutateRes, AllDataResType } from "@/types/column";
import style from "./TaskColumn.module.scss";

type Props = {
  boardId: string;
  currentColDataIndex: number;
};
const BASE_DATA_INDEX = 65536;
// TODO style 是共用的，尚未拆分
function AddColumn({ boardId, currentColDataIndex }: Props) {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const ref = useClickOutside(() => setIsAddingColumn(false));

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (newTask: {
      boardId: string;
      title: string;
      dataIndex: number;
    }) => addColumns(newTask),
    onSuccess: (resData: ColumnMutateRes) => {
      const newData = { id: resData.id, title: resData.title, tasks: [] };
      queryClient.setQueryData(["tasks"], (oldData: AllDataResType) => {
        return {
          ...oldData,
          columns: [...oldData.columns, newData],
        };
      });
    },
  });

  const handleAddColumn = () => {
    setIsAddingColumn(false);
    setNewColumnTitle("");
    mutate({
      boardId: boardId,
      title: newColumnTitle,
      dataIndex: currentColDataIndex + BASE_DATA_INDEX,
    });
  };
  return (
    <Flex style={{ flexShrink: 0 }}>
      <Box>
        {isAddingColumn ? (
          <>
            <Stack className={style.columnContainer} ref={ref}>
              <Textarea
                autoFocus
                placeholder="為列表輸入標題"
                autosize
                onChange={(e) => setNewColumnTitle(e.target.value)}
                style={{ margin: "0 4px" }}
              />
              <Flex style={{ padding: "0 4px" }}>
                <Button onClick={handleAddColumn}>新增列表</Button>
                <ActionIcon
                  variant="transparent"
                  color="white"
                  aria-label="Close"
                  size={"lg"}
                  className={style.actionIcon}
                >
                  <IconX onClick={() => setIsAddingColumn(false)} />
                </ActionIcon>
              </Flex>
            </Stack>
          </>
        ) : (
          <Stack className={style.columnContainer}>
            <Stack className={style.addButtonContainer}>
              <Button color="#4592af" onClick={() => setIsAddingColumn(true)}>
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
