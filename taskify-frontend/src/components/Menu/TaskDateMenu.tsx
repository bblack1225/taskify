import { Menu, Button, Text, rem, Center, CloseButton } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
  IconCalendarStats,
} from "@tabler/icons-react";
import { useState } from "react";

function TaskDateMenu() {
  const [opened, setOpened] = useState(false);

  return (
    <Menu shadow="md" width={250} opened={opened} onChange={setOpened}>
      <Menu.Target>
        <Button color={"#A9A9A9"} leftSection={<IconCalendarStats />}>
          日期
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label
          style={{ display: "grid", gridTemplateColumns: "20px 1fr 20px" }}
        >
          <Center style={{ gridColumn: "2/3" }}>日期</Center>
          <CloseButton
            onClick={() => setOpened(false)}
            style={{ gridColumn: "3/3" }}
          />
        </Menu.Label>
        <Menu.Item
          leftSection={
            <IconSettings style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Settings
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconMessageCircle style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Messages
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconPhoto style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Gallery
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconSearch style={{ width: rem(14), height: rem(14) }} />
          }
          rightSection={
            <Text size="xs" c="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          leftSection={
            <IconArrowsLeftRight style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Transfer my data
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default TaskDateMenu;
