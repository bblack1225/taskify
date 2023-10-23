import { Box, Text } from "@mantine/core"
import style from "@/src/components/TaskCard.module.scss"

type Props = {
  task: {
    id: number
    title: string
    description: string
  }
}

function TaskCard({ task }: Props) {
  return (
    <Box className={style.taskContainer}>
      <Text>{task.title}</Text>
      <Text>{task.description}</Text>
    </Box>
  )
}

export default TaskCard
