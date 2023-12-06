import { Box, Button, Flex, Stack } from "@mantine/core";
import style from "@/pages/Taskboard.module.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useRef } from "react";

const events = [{ title: "Meeting", start: new Date() }];

function CalendarPage() {
  const calendarRef = useRef<InstanceType<typeof FullCalendar> | null>(null);

  const handleClick = () => {
    const calendarApi = calendarRef?.current?.getApi();
    console.log("calendarApi", calendarApi);

    if (calendarApi) {
      calendarApi.updateSize();
    }
  };
  return (
    <Stack
      style={{
        width: "100vw",
        overflowY: "hidden",
      }}
    >
      <Flex className={style.container}>
        <Flex>行事曆</Flex>
        <Button onClick={handleClick}>click</Button>
      </Flex>
      <Box
        style={{
          // maxWidth: "100%",
          height: "100%",
          overflow: "hidden",
          paddingRight: "10px",
        }}
      >
        <FullCalendar
          windowResize={() => console.log("resize")}
          handleWindowResize={true}
          ref={calendarRef}
          windowResizeDelay={0}
          height="100%"
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
