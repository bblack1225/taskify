import { Menu, Button, Checkbox, Center, CloseButton } from "@mantine/core";
import { IconBallpen, IconTagStarred } from "@tabler/icons-react";
import style from "./TaskTagMenu.module.scss";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LabelRes } from "@/types/labels";

type Props = {
  selectedLabels: string[];
};

function TaskLabelMenu({ selectedLabels }: Props) {
  const [opened, setOpened] = useState(false);
  const queryClient = useQueryClient();
  const labels = queryClient.getQueryData<LabelRes[]>(["labels"]);

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
        {labels?.map((label) => (
          <div key={label.id} style={{ display: "flex", margin: "2px" }}>
            <Checkbox
              id={label.id.toString()}
              className={style.checkbox}
              checked={selectedLabels.includes(label.id)}
              // onChange={() => handleLabels(label.id)}
              onChange={() => console.log("change labels")}
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

export default TaskLabelMenu;
