import { Button, Flex, Input, Textarea } from "@mantine/core"

function TaskBoard() {
  return (
    <Flex style={{ width: "200em" }}>
      <Flex>
        <Flex>
          <Input type="text" placeholder="Taskify" />
        </Flex>
      </Flex>
      <Flex>
        <Flex>
          <Input type="text" placeholder="test input" />
          <Textarea defaultValue="test" />
          <Button>test button</Button>
        </Flex>
        <Flex>
          <Input type="text" placeholder="test input" />
          <Textarea defaultValue="test" />
          <Button>test button</Button>
        </Flex>
        <Flex>
          <Input type="text" placeholder="test input" />
          <Textarea defaultValue="test" />
          <Button>test button</Button>
        </Flex>
        <Flex>
          <Input type="text" placeholder="test input" />
          <Textarea defaultValue="test" />
          <Button>test button</Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default TaskBoard
