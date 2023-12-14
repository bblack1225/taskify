import {
  Menu,
  Button,
  Center,
  CloseButton,
  Text,
  Flex,
  Container,
} from "@mantine/core";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import { IconCalendarStats } from "@tabler/icons-react";
import "@mantine/dates/styles.css";
import { useState } from "react";
import { BaseTaskRes } from "@/types/column";
import dayjs from "dayjs";
import { UpdateDateReq } from "@/types/task";
import { notifications } from "@mantine/notifications";

type Props = {
  handleUpdateDate: (data: UpdateDateReq) => void;
  task: BaseTaskRes;
};
function TaskDateMenu({ handleUpdateDate, task }: Props) {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<[Date | null, Date | null]>([
    task.startDate ? dayjs(task.startDate).toDate() : null,
    task.dueDate ? dayjs(task.dueDate).toDate() : null,
  ]);

  const handleDatePicker = () => {
    const start = value[0] ? dayjs(value[0]).format("YYYY-MM-DD") : "";
    const end = value[1] ? dayjs(value[1]).format("YYYY-MM-DD") : "";

    if (!end && !start) {
      notifications.show({
        message: "尚未指定日期",
        autoClose: 2000,
      });
      setOpened(false);
      return;
    }

    handleUpdateDate({
      id: task.id,
      startDate: start,
      dueDate: end,
    });

    setOpened(false);
  };
  const handleCancelDate = () => {
    setValue([null, null]);
    if (!task.startDate && !task.dueDate) {
      setOpened(false);
      return;
    }
    handleUpdateDate({
      id: task.id,
      startDate: "",
      dueDate: "",
    });
    setOpened(false);
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
          <CloseButton style={{ gridColumn: "3/3" }} />
        </Menu.Label>
        <Text ta={"center"} size="xs" c={"blue"}>
          {value[0] ? dayjs(value[0]).format("YYYY-MM-DD") : "未選擇"} ~ {""}
          {value[1] ? dayjs(value[1]).format("YYYY-MM-DD") : "未選擇"}
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
          <Flex justify={"space-between"}>
            <Button mt={3} ml={7} onClick={handleDatePicker}>
              儲存
            </Button>
            <Button mt={3} ml={7} onClick={handleCancelDate}>
              取消
            </Button>
          </Flex>
        </Container>
      </Menu.Dropdown>
    </Menu>
  );
}

export default TaskDateMenu;
