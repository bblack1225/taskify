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
import { addLabel, editLabel } from "@/api/labels";
import { useLabelsData } from "@/context/LabelsContext";
import { notifications } from "@mantine/notifications";
import { BaseDataRes } from "@/types/column";
import { v4 as uuidV4 } from "uuid";

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

function TaskLabelMenu({ selectedLabels, onLabelChange }: Props) {
  const [opened, setOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddLabel, setIsAddLabel] = useState(false);
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

  // 這邊是要把props跟change後的值傳回去，可能是值變少(unchecked)，或是值變多(checked)
  // 邏輯大概是下方註解的樣子，或許push跟filter的方式可以改成更優雅的方式，但我目前不知道
  const handleChange = (checked: boolean, id: string) => {
    onLabelChange(id, checked);
  };

  const handleEditLabelOpen = (label: TaskLabel) => {
    setIsAddLabel(false);
    setIsEditing(true);
    setCurrentLabel({
      id: label.id,
      name: label.name,
      color: label.color,
    });
  };

  //新增空標籤
  const handleAddLabel = () => {
    setIsAddLabel(true);
    setIsEditing(true);
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
    setOpened(false);
    setIsEditing(false);
  };

  return (
    <Menu
      transitionProps={{ duration: 0 }}
      shadow="md"
      width={250}
      opened={opened}
      onChange={setOpened}
      onClose={() => setIsEditing(false)}
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
          {isEditing && (
            <IconChevronLeft
              onClick={() => {
                setIsEditing(false);
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
            {isEditing ? (isAddLabel ? "新增標籤" : "編輯標籤") : "標籤"}
          </Center>
          <IconX
            onClick={() => setOpened(false)}
            style={{
              gridColumn: "3/4",
              cursor: "pointer",
            }}
            className={style.closeButton}
          />
        </Menu.Label>
        {isEditing ? (
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
                <Button mb={10} onClick={handleLabelSave}>
                  {isAddLabel ? "建立" : "儲存"}
                </Button>
              </Stack>
            </Center>
          </>
        ) : (
          <>
            <Box
              style={{
                overflow: "hidden auto",
                height: "428px",
              }}
            >
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
            <Center>
              <Button w={200} mb={10} onClick={handleAddLabel}>
                新增標籤
              </Button>
            </Center>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

export default TaskLabelMenu;
