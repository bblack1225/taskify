import {
  Menu,
  Button,
  Checkbox,
  Center,
  Text,
  Box,
  ColorPicker,
  Stack,
  Input,
  Flex,
} from "@mantine/core";
import {
  IconBallpen,
  IconChevronLeft,
  IconMoodCheck,
  IconTagStarred,
  IconX,
} from "@tabler/icons-react";
import style from "./TaskLabelMenu.module.scss";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskLabel } from "@/types/labels";
import { addLabel, delLabel, editLabel } from "@/api/labels";
import { useLabelsData } from "@/context/useLabelsData";
import { notifications } from "@mantine/notifications";
import { BaseDataRes } from "@/types/column";

type Props = {
  selectedLabels: string[];
  onLabelChange: (labelId: string, checked: boolean) => void;
};

const defaultColor = [
  "#FFDFDF",
  "#EBE3D5",
  "#87C4FF",
  "#CE5A67",
  "#FF9B50",
  "#FFE17B",
  "#B6E2A1",
  "#D3CEDF",
  "#E5D4FF",
  "#D8E1CE",
];

enum LabelMenuType {
  DEFAULT = "DEFAULT",
  EDIT = "EDIT",
  ADD = "ADD",
  DELETE = "DELETE",
}

type PreviousModeType = LabelMenuType.DEFAULT | LabelMenuType.EDIT | "";

const labelMenuMode: {
  [key in LabelMenuType]: {
    key: LabelMenuType;
    title: string;
    canGoBack: boolean;
    previousMode: PreviousModeType;
  };
} = {
  DEFAULT: {
    key: LabelMenuType.DEFAULT,
    title: "標籤",
    canGoBack: false,
    previousMode: "",
  },
  EDIT: {
    key: LabelMenuType.EDIT,
    title: "編輯標籤",
    canGoBack: true,
    previousMode: LabelMenuType.DEFAULT,
  },
  ADD: {
    key: LabelMenuType.ADD,
    title: "新增標籤",
    canGoBack: true,
    previousMode: LabelMenuType.DEFAULT,
  },
  DELETE: {
    key: LabelMenuType.DELETE,
    title: "刪除標籤",
    canGoBack: true,
    previousMode: LabelMenuType.EDIT,
  },
};

function TaskLabelMenu({ selectedLabels, onLabelChange }: Props) {
  const [isOpened, setIsOpened] = useState(false);
  const [currentMode, setCurrentMode] = useState(labelMenuMode.DEFAULT);

  const queryClient = useQueryClient();
  const labels = useLabelsData();

  const [currentLabel, setCurrentLabel] = useState({
    id: "",
    name: "",
    color: "",
  });

  const editLabelMutation = useMutation({
    mutationFn: () => editLabel(currentLabel),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["labels"] });
      const previousLabels = queryClient.getQueryData(["labels"]);
      queryClient.setQueryData(["labels"], (oldData: TaskLabel[]) => {
        return oldData.map((label) => {
          if (label.id === currentLabel.id) {
            return {
              ...label,
              name: currentLabel.name,
              color: currentLabel.color,
            };
          }
          return label;
        });
      });
      return { previousLabels };
    },
    onSuccess: () => {
      notifications.show({
        icon: <IconMoodCheck />,
        message: "更新標籤成功",
        autoClose: 2000,
      });
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["labels"], context?.previousLabels);
    },
  });

  const queryData = queryClient.getQueryData<BaseDataRes>([
    "tasks",
  ]) as BaseDataRes;

  const addLabelMutation = useMutation({
    mutationFn: () =>
      addLabel({
        boardId: queryData.boardId,
        color: currentLabel.color,
        name: currentLabel.name,
      }),

    onSuccess: (res: TaskLabel) => {
      queryClient.setQueryData(["labels"], (oldData: TaskLabel[]) => {
        return [...oldData, res];
      });
      notifications.show({
        icon: <IconMoodCheck />,
        message: "新增標籤成功",
        autoClose: 2000,
      });
    },
  });

  const delLabelMutation = useMutation({
    mutationFn: () => delLabel(currentLabel.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["labels"] });
      queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
        return {
          ...oldData,
          tasks: oldData.tasks.map((oldTask) => {
            return {
              ...oldTask,
              labels: oldTask.labels.filter(
                (labelId) => labelId !== currentLabel.id
              ),
            };
          }),
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      notifications.show({
        icon: <IconMoodCheck />,
        message: "刪除標籤成功",
        autoClose: 2000,
      });
    },
  });

  // 這邊是要把props跟change後的值傳回去，可能是值變少(unchecked)，或是值變多(checked)
  // 邏輯大概是下方註解的樣子，或許push跟filter的方式可以改成更優雅的方式，但我目前不知道
  const handleChange = (checked: boolean, id: string) => {
    onLabelChange(id, checked);
  };

  const handleEditLabelOpen = (label: TaskLabel) => {
    setCurrentMode(labelMenuMode.EDIT);
    setCurrentLabel({
      id: label.id,
      name: label.name,
      color: label.color,
    });
  };

  //新增空標籤
  const handleAddLabel = () => {
    setCurrentMode(labelMenuMode.ADD);
    setCurrentLabel({ id: "", name: "", color: "" });
  };

  const handleLabelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLabel((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleLabelSave = () => {
    if (currentLabel.id) {
      editLabelMutation.mutate();
    } else {
      addLabelMutation.mutate();
    }
    setCurrentMode(labelMenuMode.DEFAULT);
  };

  const handleDelLabel = () => {
    delLabelMutation.mutate();
    setCurrentMode(labelMenuMode.DEFAULT);
  };

  return (
    <Menu
      transitionProps={{ duration: 0 }}
      shadow="md"
      width={250}
      opened={isOpened}
      onChange={setIsOpened}
      onClose={() => setCurrentMode(labelMenuMode.DEFAULT)}
    >
      <Menu.Target>
        <Button color={"#A9A9A9"} leftSection={<IconTagStarred />}>
          標籤
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label
          style={{
            display: "grid",
            gridTemplateColumns: "20px 1fr 20px",
          }}
        >
          {currentMode.canGoBack && (
            <IconChevronLeft
              onClick={() => {
                const previousMode: PreviousModeType = currentMode.previousMode;
                if (previousMode) {
                  setCurrentMode(labelMenuMode[previousMode]);
                }
              }}
              style={{
                gridColumn: "1/2",
                position: "absolute",
                left: "10",
                cursor: "pointer",
              }}
            />
          )}
          <Center style={{ gridColumn: "2/3" }}>{currentMode.title}</Center>
          <IconX
            onClick={() => {
              setIsOpened(false);
              setCurrentMode(labelMenuMode.DEFAULT);
            }}
            style={{
              gridColumn: "3/4",
              cursor: "pointer",
            }}
            className={style.closeButton}
          />
        </Menu.Label>
        {currentMode.key === LabelMenuType.DELETE && (
          <>
            <Text size="md" mb={10} c={"red"} style={{ textAlign: "center" }}>
              確定刪除？刪除後將無法復原
            </Text>
            <Flex justify={"space-between"}>
              <Button color="red" onClick={handleDelLabel}>
                確定刪除
              </Button>
            </Flex>
          </>
        )}
        {currentMode.key === LabelMenuType.DEFAULT && (
          <>
            <Box style={{ overflow: "hidden auto", maxHeight: "428px" }}>
              <Box>
                {labels.map((label) => (
                  <div
                    key={label.id}
                    style={{
                      display: "flex",
                      margin: "2px",
                    }}
                  >
                    <Checkbox
                      id={label.id.toString()}
                      className={style.checkbox}
                      checked={selectedLabels.includes(label.id)}
                      onChange={(e) => handleChange(e.target.checked, label.id)}
                      color="gray"
                      styles={{
                        root: {
                          marginBottom: 5,
                        },
                      }}
                    />
                    <label
                      htmlFor={label.id.toString()}
                      className={style.labelContainer}
                      style={{ backgroundColor: `${label.color}` }}
                    >
                      <span>{label.name}</span>
                    </label>
                    <div>
                      <IconBallpen
                        onClick={() => {
                          handleEditLabelOpen(label);
                        }}
                        style={{
                          marginLeft: "3px",
                          marginRight: "8px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Box>
            </Box>
            <Center>
              <Button w={200} mb={10} onClick={handleAddLabel}>
                新增標籤
              </Button>
            </Center>
          </>
        )}
        {(currentMode.key === LabelMenuType.EDIT ||
          currentMode.key === LabelMenuType.ADD) && (
          <>
            <Box
              w={240}
              h={40}
              bg={"#f7f8f9"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Center
                className={style.isEditingLabelContainer}
                style={{ background: currentLabel.color }}
              >
                <span>{currentLabel.name}</span>
              </Center>
            </Box>
            <Center>
              <Stack gap="xs">
                <Text size="xs" mt={10}>
                  標題
                </Text>
                <Input
                  size="xs"
                  defaultValue={currentLabel.name}
                  autoFocus
                  onChange={handleLabelNameChange}
                />
                <Text size="xs">選一個顏色</Text>
                <ColorPicker
                  swatchesPerRow={5}
                  format="hex"
                  swatches={defaultColor}
                  value={currentLabel.color}
                  onChange={(val) =>
                    setCurrentLabel((prev) => ({ ...prev, color: val }))
                  }
                />
                <hr style={{ width: "100%" }} />
                <Flex justify={"space-between"}>
                  <Button mb={10} onClick={handleLabelSave}>
                    {currentMode.key === LabelMenuType.ADD ? "建立" : "儲存"}
                  </Button>
                  {currentMode.key === LabelMenuType.EDIT && (
                    <Button
                      color="red"
                      onClick={() => setCurrentMode(labelMenuMode.DELETE)}
                    >
                      刪除
                    </Button>
                  )}
                </Flex>
              </Stack>
            </Center>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

export default TaskLabelMenu;
