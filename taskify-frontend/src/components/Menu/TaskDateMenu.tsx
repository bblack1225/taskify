import {
  Menu,
  Button,
  Center,
  CloseButton,
  Text,
  Flex,
  Container,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconCalendarStats } from "@tabler/icons-react";
import "@mantine/dates/styles.css";
import { useState } from "react";

function TaskDateMenu() {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  console.log("value", value);

  return (
    <Menu shadow="md" width={300} opened={opened} onChange={setOpened}>
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
        <Text ta={"center"} size="xs" c={"blue"}>
          請選擇『起始日期』及『截止日期』
        </Text>
        <Container mt={10} mb={10}>
          <Flex direction={"column"} align={"center"}>
            <DatePicker
              defaultDate={new Date()}
              type="range"
              allowSingleDateInRange
              value={value}
              onChange={setValue}
            />
          </Flex>
          <Button mt={3} ml={7}>
            儲存
          </Button>
        </Container>
      </Menu.Dropdown>
    </Menu>
  );
}

export default TaskDateMenu;
