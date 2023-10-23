import { Box, Button, Flex, Input, Stack, Text, Textarea } from "@mantine/core";

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
      {
        id: 3,
        title: "Task 3",
        description: "This is yet another test task",
      },
      {
        id: 4,
        title: "Task 4",
        description: "This is yet another test task",
      },
      {
        id: 5,
        title: "Task 5",
        description: "This is yet another test task",
      },
      {
        id: 6,
        title: "Task 6",
        description: "This is yet another test task",
      },
      {
        id: 7,
        title: "Task 7",
        description: "This is yet another test task",
      },
      {
        id: 8,
        title: "Task 8",
        description: "This is yet another test task",
      },
      {
        id: 9,
        title: "Task 9",
        description: "This is yet another test task",
      },
      {
        id: 10,
        title: "Task 10",
        description: "This is yet another test task",
      },
      {
        id: 11,
        title: "Task 11",
        description: "This is yet another test task",
      },
    ],
  },
  {
    id: 2,
    title: "In Progress",
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
      {
        id: 3,
        title: "Task 3",
        description: "This is yet another test task",
      },
    ],
  },
  {
    id: 3,
    title: "Done",
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
      {
        id: 3,
        title: "Task 3",
        description: "This is yet another test task",
      },
      {
        id: 4,
        title: "Task 4",
        description: "This is yet another test task",
      },
      {
        id: 5,
        title: "Task 5",
        description: "This is yet another test task",
      },
    ],
  },
  {
    id: 4,
    title: "Testing",
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
                  padding: "12px 2px 12px 5px",
                  borderRadius: 10,
                  maxHeight: "calc(100% - 5px)",
                }}
              >
                <Input
                  defaultValue={column.title}
                  // 為了因應tasks區塊的scroll bar空隙，所以margin要調整，後續可以重構
                  style={{ marginLeft: 4, marginRight: 14, padding: "2px 4px" }}
                />
                <Stack
                  style={{
                    overflowX: "hidden",
                    overflowY: "auto",
                    margin: "0 4px",
                    padding: "2px 4px",
                    gap: 8,
                  }}
                >
                  {column.tasks.map((task) => (
                    <Box
                      style={{
                        background: "#ccc",
                        padding: "10px",
                        flexShrink: 0,
                        borderRadius: 10,
                      }}
                      key={task.id}
                    >
                      <Text>{task.title}</Text>
                      <Text>{task.description}</Text>
                    </Box>
                  ))}
                </Stack>
                <Stack
                  // 為了因應tasks區塊的scroll bar空隙，所以margin要調整，後續可以重構
                  style={{ marginLeft: 4, marginRight: 14, padding: "2px 4px" }}
                >
                  <Textarea defaultValue="test" />
                  <Button>test button</Button>
                </Stack>
              </Stack>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Stack>
  );
}

export default TaskBoard;
