import { Box, Button, Stack } from "@mantine/core";
import Avatar from "/public/lazy.png";
import {
  IconAlignBoxBottomCenter,
  IconUsers,
  IconCalendarSearch,
  IconHeartDown,
} from "@tabler/icons-react";

import style from "./NavBoard.module.scss";
import { Link as RouterLink } from "@tanstack/react-router";

function NavBoard() {
  return (
    <Box p={20}>
      <Box>
        <div className={style.navTitle}>TwoYu</div>
        <img src={Avatar} alt="萬聖節快樂" width={"200px"} />
      </Box>
      <Stack pt={10}>
        <Button color="#be3144">
          <IconAlignBoxBottomCenter />
          <RouterLink to="/taskify/board">
            <Box p={5}>看板</Box>
          </RouterLink>
        </Button>
        <Button color="#d55b3e">
          <IconUsers />
          <Box p={5}>成員</Box>
        </Button>
        <Button color="#be3144">
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
