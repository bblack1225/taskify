import { Flex, Stack } from "@mantine/core"
import TaskColumn from "../components/TaskColumn"

function TaskBoard() {
  return (
    <Stack>
      <Flex>
        <Flex>Taskify</Flex>
      </Flex>
      <TaskColumn />
    </Stack>
  )
}

export default TaskBoard
