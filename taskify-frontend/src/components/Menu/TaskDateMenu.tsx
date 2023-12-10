import {
  Menu,
  Button,
  Center,
  CloseButton,
  Text,
  Flex,
  Container,
  Indicator,
} from "@mantine/core";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import { IconCalendarStats } from "@tabler/icons-react";
import "@mantine/dates/styles.css";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BaseDataRes, BaseTaskRes } from "@/types/column";
import dayjs from "dayjs";

function TaskDateMenu({ task }: { task: BaseTaskRes }) {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  const queryClient = useQueryClient();

  //now是要傳回給後端的
  // const now = new Date().toISOString();

  const handleDatePicker = () => {
    if (value[0] === null || value[1] === null) {
      return;
    }
    const start = value[0].toLocaleDateString();
    const end = value[1].toLocaleDateString();
    setOpened(false);
    queryClient.setQueryData(["tasks"], (oldData: BaseDataRes) => {
      return {
        ...oldData,
        tasks: oldData.tasks.map((oldTask) => {
          if (oldTask.id !== task.id) {
            return oldTask;
          } else {
            return {
              ...oldTask,
              startDate: start,
              dueDate: end,
            };
          }
        }),
      };
    });
    return { start, end };
  };

  const getDayProps: DatePickerProps["getDayProps"] = (date) => {
    if (
      dayjs(value[0]).isSame(dayjs(date), "date") ||
      dayjs(value[1]).isSame(dayjs(date), "date")
    ) {
      return {
        style: {
          backgroundColor: "var(--mantine-color-blue-filled)",
          color: "var(--mantine-color-white)",
        },
      };
    } else if (dayjs(date).isSame(dayjs(new Date()), "date")) {
      return {
        style: {
          backgroundColor: "var(--mantine-color-pink-filled)",
          color: "var(--mantine-color-white)",
        },
      };
    }

    return {};
  };
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
          {value[0] ? value[0].toLocaleDateString() : "未選擇"} - {""}
          {value[1] ? value[1].toLocaleDateString() : "未選擇"}
        </Text>
        <Container mt={10} mb={10}>
          <Flex direction={"column"} align={"center"}>
            <DatePicker
              getDayProps={getDayProps}
              type="range"
              allowSingleDateInRange
              value={value}
              onChange={setValue}
            />
          </Flex>
          <Button mt={3} ml={7} onClick={handleDatePicker}>
            儲存
          </Button>
        </Container>
      </Menu.Dropdown>
    </Menu>
  );
}

export default TaskDateMenu;
