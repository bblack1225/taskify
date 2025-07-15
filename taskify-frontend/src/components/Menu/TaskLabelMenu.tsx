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
  Loader,
  isLightColor,
} from "@mantine/core";
import {
  IconAlertCircleFilled,
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
      const previousLabels =
        queryClient.getQueryData<TaskLabel[]>(["labels"]) || [];
      const newLabels = previousLabels.filter(
        (oldLabel) => oldLabel.id !== currentLabel.id
      );
      queryClient.setQueryData(["labels"], newLabels);
      return { previousLabels };
    },

    onSuccess: () => {
      queryClient.invalidateQueries();
      setCurrentMode(labelMenuMode.DEFAULT);
      notifications.show({
        icon: <IconMoodCheck />,
        message: "刪除標籤成功",
        autoClose: 2000,
      });
    },
  });

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
    setCurrentLabel({ id: "", name: "", color: defaultColor[0] });
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
  };

  return (
    <Menu
      transitionProps={{ duration: 0 }}
      shadow="md"
      width={300}
      opened={isOpened}
      onChange={setIsOpened}
      onClose={() => {
        setCurrentMode(labelMenuMode.DEFAULT);
      }}
    >
      <Menu.Target>
        <Button
          color={"#A9A9A9"}
          leftSection={<IconTagStarred stroke={1.5} size={24} />}
        >
          標籤
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label
          style={{
            display: "grid",
            gridTemplateColumns: "20px 1fr 20px",
            marginBottom: "4px",
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
          <Center style={{ gridColumn: "2/3" }}>
            <Text size="sm">{currentMode.title}</Text>
          </Center>
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
          <Flex direction={"column"} p={10}>
            <Text size="md" mb={10} c={"red"} style={{ textAlign: "center" }}>
              <IconAlertCircleFilled />
              <Stack />
              刪除後將無法復原
            </Text>
            <Button color="red" onClick={handleDelLabel}>
              {delLabelMutation.isPending ? (
                <Loader color="rgba(250, 250, 250, 1)" size="sm" />
              ) : (
                "確定刪除"
              )}
            </Button>
          </Flex>
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
                      justifyContent: "center",
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
                      <Text
                        size="sm"
                        c={isLightColor(label.color) ? "black" : "white"}
                      >
                        {label.name}
                      </Text>
                    </label>
                    <div>
                      <IconBallpen
                        stroke={1.5}
                        size={24}
                        onClick={() => {
                          handleEditLabelOpen(label);
                        }}
                        style={{
                          margin: "0 3",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Box>
            </Box>
            <Center>
              <Button w={150} my={10} onClick={handleAddLabel} color="#d55b3e">
                新增標籤
              </Button>
            </Center>
          </>
        )}
        {(currentMode.key === LabelMenuType.EDIT ||
          currentMode.key === LabelMenuType.ADD) && (
          <>
            <Box
              h={40}
              bg={"#f7f8f9"}
              style={{
                margin: "8px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Center
                className={style.isEditingLabelContainer}
                style={{
                  background: currentLabel.color,
                }}
              >
                <Text
                  size="sm"
                  c={isLightColor(currentLabel.color) ? "black" : "white"}
                >
                  {currentLabel.name}
                </Text>
              </Center>
            </Box>
            <Center>
              <Stack gap="xs">
                <Text size="sm" mt={10}>
                  🌱 標題
                </Text>
                <Input
                  size="sm"
                  defaultValue={currentLabel.name}
                  autoFocus
                  onChange={handleLabelNameChange}
                />
                <Text size="sm">⭐ 選顏色</Text>
                <ColorPicker
                  swatchesPerRow={5}
                  format="hex"
                  swatches={defaultColor}
                  value={currentLabel.color}
                  onChange={(val) =>
                    setCurrentLabel((prev) => ({ ...prev, color: val }))
                  }
                />
                <Flex justify={"space-between"}>
                  <Button
                    variant="filled"
                    color="orange"
                    radius="md"
                    mb={10}
                    onClick={handleLabelSave}
                  >
                    {currentMode.key === LabelMenuType.ADD ? "建立" : "儲存"}
                  </Button>
                  {currentMode.key === LabelMenuType.EDIT && (
                    <Button
                      variant="filled"
                      color="gray"
                      radius="md"
                      mb={10}
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
