import { Box, Button, Flex, Input, Stack, Text, Textarea } from "@mantine/core";
import { Fragment } from "react";

const COLUMN_DATA = [
  {
    id: 1,
    title: "To Do",
    tasks: [
      {
        id: 1,
        title: "Task 1",
        description: "This is a test task",
      },
      {
        id: 2,
        title: "Task 2",
        description: "This is another test task",
      },
    ],
  },
  {
    id: 2,
    title: "In Progress",
    tasks: [],
  },
  {
    id: 3,
    title: "Done",
    tasks: [],
  },
  {
    id: 4,
    title: "Testing",
    tasks: [],
  },
];

function TaskBoard() {
  return (
    <Stack>
      <Flex>
        <Flex>Taskify</Flex>
      </Flex>
      <Flex
        style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          flex: 1,
          gap: "10px",
        }}
      >
        {COLUMN_DATA.map((column) => (
          <Flex style={{ flexShrink: 0 }} key={column.id}>
            <Box>
              <Stack
                style={{
                  width: "300px",
                  background: "#eae9e9",
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Input defaultValue={column.title} />
                {column.tasks.map((task) => (
                  <Box
                    style={{
                      background: "#ccc",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                    key={task.id}
                  >
                    <Text>{task.title}</Text>
                    <Text>{task.description}</Text>
                  </Box>
                ))}
                <Textarea defaultValue="test" />
                <Button>test button</Button>
              </Stack>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Stack>
  );
}

export default TaskBoard;
