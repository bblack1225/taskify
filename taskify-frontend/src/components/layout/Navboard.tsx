import { Box, Button, Stack } from "@mantine/core";
import Avatar from "/public/trick-or-treat.png";

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
        <Button color="#d55b3e">看板</Button>
        <Button color="#d55b3e">成員</Button>
        <Button color="#d55b3e">行事曆</Button>
        <Button color="#d55b3e">你的看板</Button>
      </Stack>
    </Box>
  );
}

export default NavBoard;
