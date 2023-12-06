import { Flex, Stack } from "@mantine/core";
import style from "@/pages/Taskboard.module.scss";
import { useState } from "react";
import { DatePicker } from "@mantine/dates";

function CalendarPage() {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <Stack style={{ overflow: "auto hidden" }}>
      <Flex className={style.container}>
        <Flex>行事曆</Flex>
      </Flex>
      <Flex w={1000} h={1000}>
        <DatePicker value={value} onChange={setValue} />
      </Flex>
    </Stack>
  );
}

export default CalendarPage;
