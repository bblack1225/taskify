import { Box, Button, Stack } from "@mantine/core";
import Avatar from "/public/trick-or-treat.png";
import {
  IconAlignBoxBottomCenter,
  IconUsers,
  IconCalendarSearch,
  IconHeartDown,
} from "@tabler/icons-react";
function NavBoard() {
  return (
    <Box p={20}>
      <Box>
        <div
          style={{
            color: "#d55b3e",
            padding: "5px",
            marginBottom: "10px",
          }}
        >
          Keely Lin
        </div>
        <img src={Avatar} alt="萬聖節快樂" width={"200px"} />
      </Box>
      <Stack pt={10}>
        <Button color="#d55b3e">
          <IconAlignBoxBottomCenter />
          <Box p={5}>看板</Box>
        </Button>
        <Button color="#d55b3e">
          <IconUsers />
          <Box p={5}>成員</Box>
        </Button>
        <Button color="#d55b3e">
          <IconCalendarSearch />
          <Box p={5}>行事曆</Box>
        </Button>
        <Button color="#d55b3e">
          <IconHeartDown />
          <Box p={5}>你的看板</Box>
        </Button>
      </Stack>
    </Box>
  );
}

export default NavBoard;
