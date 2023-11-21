import {
  Menu,
  Button,
  Checkbox,
  Center,
  Group,
  HoverCard,
  Text,
  Box,
  ColorPicker,
  Stack,
  Input,
} from "@mantine/core";
import {
  IconBallpen,
  IconChevronLeft,
  IconTagStarred,
  IconX,
} from "@tabler/icons-react";
import style from "./TaskLabelMenu.module.scss";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TaskLabel } from "@/types/labels";

type Props = {
  selectedLabels: string[];
  onLabelChange: (labelIds: string[]) => void;
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
  const queryClient = useQueryClient();
  const labels = queryClient.getQueryData<TaskLabel[]>(["labels"]) || [];

  const [editLabel, setEditLabel] = useState({
    id: "",
    name: "",
    color: "",
  });
  const [value, onChange] = useState(editLabel.color);

  // 這邊是要把props跟change後的值傳回去，可能是值變少(unchecked)，或是值變多(checked)
  // 邏輯大概是下方註解的樣子，或許push跟filter的方式可以改成更優雅的方式，但我目前不知道
  const handleChange = (checked: boolean, id: string) => {
    const oldSelectedLabels = [...selectedLabels];
    if (checked) {
      oldSelectedLabels.push(id);
      onLabelChange(oldSelectedLabels);
    } else {
      const newLabelIds = oldSelectedLabels.filter((labelId) => labelId !== id);
      onLabelChange(newLabelIds);
    }
  };

  const handleEditLabel = (label: TaskLabel) => {
    setIsEditing(true);
    setEditLabel({
      id: label.id,
      name: label.name,
      color: label.color,
    });
  };

  return (
    <Menu shadow="md" width={250} opened={opened} onChange={setOpened}>
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
              onClick={() => setIsEditing(false)}
              style={{
                gridColumn: "1/2",
                position: "absolute",
                left: "10",
                cursor: "pointer",
              }}
            />
          )}
          <Center style={{ gridColumn: "2/3" }}>
            {isEditing ? "編輯標籤" : "標籤"}
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
            <Group
              key={editLabel.id}
              onClick={(e) => {
                e.stopPropagation();
              }}
              justify="center"
            >
              <HoverCard openDelay={300}>
                <HoverCard.Target>
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
                      style={{ backgroundColor: `${editLabel.color}` }}
                    >
                      <span>{editLabel.name}</span>
                    </Center>
                  </Box>
                </HoverCard.Target>
                <HoverCard.Dropdown h={20} className={style.dropdown}>
                  <Text size="xs">標題：『{editLabel.name}』</Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>
            <Center>
              <Stack gap="xs">
                <Text size="xs" mt={10}>
                  標題
                </Text>
                <Input size="xs" defaultValue={editLabel.name} />
                <Text size="xs">選一個顏色</Text>
                <ColorPicker
                  swatchesPerRow={5}
                  format="hex"
                  swatches={defaultColor}
                  value={value}
                />
                <hr style={{ width: "100%" }} />
                <Button mb={10}>儲存</Button>
              </Stack>
            </Center>
          </>
        ) : (
          <>
            {labels.map((label) => (
              <div key={label.id} style={{ display: "flex", margin: "2px" }}>
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
                    onClick={() => handleEditLabel(label)}
                    style={{ marginLeft: "3px", cursor: "pointer" }}
                  />
                </div>
              </div>
            ))}
            <Center>
              <Button w={200} mb={10}>
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
