import { Box, Text } from "@mantine/core";
import style from "@/components/TaskCard.module.scss";

type Props = {
  task: {
    id: string;
    name: string;
    description: string;
  };
};

function TaskCard({ task }: Props) {
  return (
    <Box className={style.taskContainer}>
      <Text>{task.name}</Text>
    </Box>
  );
}

export default TaskCard;
