import { Box, Button, Stack } from "@mantine/core";
import Avatar from "/public/lazy.png";
import {
  IconAlignBoxBottomCenter,
  IconUsers,
  IconCalendarSearch,
  IconHeartDown,
} from "@tabler/icons-react";
import style from "./NavBoard.module.scss";

function NavBoard() {
  return (
    <Box p={20}>
      <Box>
        <div className={style.navTitle}>TwoYu</div>
        <img src={Avatar} alt="關於聖誕節的圖片" width={"200px"} />
      </Box>
      <Stack pt={10}>
        <Button color="#be3144">
          <IconAlignBoxBottomCenter />
          <Box p={5}>看板</Box>
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
