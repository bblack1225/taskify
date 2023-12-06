import { Box, Flex, Stack } from "@mantine/core";
import style from "@/pages/Taskboard.module.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const events = [{ title: "Meeting", start: new Date() }];

function CalendarPage() {
  return (
    <Stack
      style={{
        width: "100vw",
        overflowY: "hidden",
      }}
    >
      <Flex className={style.container}>
        <Flex>行事曆</Flex>
      </Flex>
      <Box style={{ overflow: "hidden auto", paddingRight: "10px" }}>
        <FullCalendar
          initialView="dayGridMonth"
          displayEventTime={true}
          events={events}
          plugins={[dayGridPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}

          // selectable={true}
          // selectMirror={true}
          // dayMaxEvents={true}
          /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
        />
      </Box>
    </Stack>
  );
}

export default CalendarPage;
