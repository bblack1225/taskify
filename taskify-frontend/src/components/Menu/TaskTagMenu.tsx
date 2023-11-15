import { Menu, Button, Checkbox, Center, CloseButton } from "@mantine/core";
import { IconBallpen, IconTagStarred } from "@tabler/icons-react";
import style from "./TaskTagMenu.module.scss";
import { useState } from "react";

const labels = [
  { id: 1, color: "#CE5A67", showLabel: true, name: "重要" },
  { id: 2, color: "#FF9B50", showLabel: true, name: "待處理事件好多好多好多" },
  { id: 3, color: "#FFE17B", showLabel: true, name: "優先" },
  { id: 4, color: "#B6E2A1", showLabel: true, name: "完成" },
  {
    id: 5,
    color: "#87C4FF",
    showLabel: true,
    name: "進行中測試～～～～～～～",
  },
  { id: 6, color: "#D3CEDF", showLabel: true, name: "註記" },
  { id: 7, color: "#E5D4FF", showLabel: true, name: "審核" },
  { id: 8, color: "#EBE3D5", showLabel: true, name: "問題" },
  { id: 9, color: "#FFDFDF", showLabel: true, name: "緊急" },
  { id: 10, color: "#F3FDE8", showLabel: false, name: "無標題" },
];

// type LabelType = {
//   id: number;
//   color: string;
//   showLabel: boolean;
//   name: string;
// };
// type Props = {
//   isLabel: LabelType[];
//   setIsLabel: (
//     updatedLabels: {
//       id: number;
//       color: string;
//       showLabel: boolean;
//       name: string;
//     }[]
//   ) => void;
// };

function TaskTagMenu() {
  const [opened, setOpened] = useState(false);
  // const handleLabels = (id: number) => {
  //   setIsLabel((prev: LabelType[]) =>
  //     prev.map((label) =>
  //       label.id === id ? { ...label, showLabel: !label.showLabel } : label
  //     )
  //   );
  // };

  return (
    <Menu shadow="md" width={200} opened={opened} onChange={setOpened}>
      <Menu.Target>
        <Button color={"#A9A9A9"} leftSection={<IconTagStarred />}>
          標籤
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label
          style={{ display: "grid", gridTemplateColumns: "20px 1fr 20px" }}
        >
          <Center style={{ gridColumn: "2/3" }}>標籤</Center>
          <CloseButton
            onClick={() => setOpened(false)}
            style={{ gridColumn: "3/3" }}
          />
        </Menu.Label>
        {labels.map((label) => (
          <div key={label.id} style={{ display: "flex", margin: "2px" }}>
            <Checkbox
              id={label.id.toString()}
              className={style.checkbox}
              checked={label.showLabel}
              // onChange={() => handleLabels(label.id)}
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
                onClick={() => setOpened(false)}
                style={{ marginLeft: "3px" }}
              />
            </div>
          </div>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

export default TaskTagMenu;
