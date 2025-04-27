import { Box, Flex, Loader, Stack } from "@mantine/core";
import style from "@/pages/Taskboard.module.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/hooks/useUser";

function CalendarPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<InstanceType<typeof FullCalendar> | null>(null);
  const userInfo = useUser();
  const { isPending, data, error } = useTasks(userInfo.boardId);

  const dateData = data?.tasks.filter((task) => task.startDate || task.dueDate);

  const events = dateData?.map((data) => {
    return {
      title: data.name,
      start: data?.startDate,
      end: `${data.dueDate?.substring(0, 10)}T23:59:59`,
    };
  });

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

  if (isPending)
    return (
      <div style={{ margin: "0 auto" }}>
        <Loader color="#4592af" type="dots" />
      </div>
    );

  if (error) return "An error has occurred: " + error.message;

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
          eventColor="#4592af"
          ref={calendarRef}
          windowResizeDelay={0}
          height="100%"
          initialView="dayGridMonth"
          displayEventTime={false}
          events={events}
          plugins={[dayGridPlugin]}
          headerToolbar={{
            left: "title",
            right: "prev,today,next",
          }}
        />
      </Box>
    </Stack>
  );
}

export default CalendarPage;
