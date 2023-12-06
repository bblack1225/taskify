import { Box, Flex, Stack } from "@mantine/core";
import style from "@/pages/Taskboard.module.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef } from "react";

const events = [{ title: "Meeting", start: new Date() }];

function CalendarPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<InstanceType<typeof FullCalendar> | null>(null);

    useEffect(() => {
    if (containerRef.current === null) {
      return;
    }
    if (calendarRef.current === null) {
      return;
    }
    const calendarApi = calendarRef.current.getApi();

    const resizeObserver = new ResizeObserver(() => calendarApi.updateSize());
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [calendarRef, containerRef]);

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
      <Box
      ref={containerRef}
        style={{
          height: "100%",
          overflow: "hidden",
          paddingRight: "10px",
        }}
      >
        <FullCalendar
          ref={calendarRef}
          windowResizeDelay={0}
          height="100%"
          initialView="dayGridMonth"
          displayEventTime={true}
          events={events}
          plugins={[dayGridPlugin]}
          headerToolbar={{
            left: "title",
            right: "prev,today,next",
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
