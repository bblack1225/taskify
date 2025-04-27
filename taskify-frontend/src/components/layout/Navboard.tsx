import { Box, Button, Flex, Stack } from "@mantine/core";
import {
  IconAlignBoxBottomCenter,
  IconCalendarSearch,
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
} from "@tabler/icons-react";

import style from "./NavBoard.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  isNavBoardOpen: boolean;
  setIsNavBoardOpen: (value: boolean) => void;
};

function NavBoard({ isNavBoardOpen, setIsNavBoardOpen }: Props) {
  const navigate = useNavigate();
  const userInfo = useUser();
  const queryClient = useQueryClient();

  return (
    <>
      {isNavBoardOpen ? (
        <Stack p={20} h={"100vh"} style={{ position: "relative" }}>
          <IconChevronLeft
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "5px",
              top: "10px",
            }}
            className={style.iconChevronLeft}
            onClick={() => setIsNavBoardOpen(false)}
          />
          <Box>
            <Flex justify={"space-between"} align={"center"} mb={20}>
              <Flex className={style.navTitle}>
                <Flex className={style.firstName}>
                  {userInfo.name.slice(0, 1)}
                </Flex>
                {userInfo.name}
              </Flex>
            </Flex>
          </Box>
          <Flex
            style={{ flex: 1 }}
            direction={"column"}
            justify={"space-between"}
          >
            <Stack pt={10}>
              <NavLink
                to="/board"
                className={({ isActive }) => (isActive ? style.active : "")}
                style={{ width: "120px" }}
              >
                <Button
                  color="#d55b3e"
                  w={"120px"}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <IconAlignBoxBottomCenter />
                  <Box p={10}>看板</Box>
                </Button>
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) => (isActive ? style.active : "")}
                style={{ width: "120px" }}
              >
                <Button
                  color="#d55b3e"
                  w={"120px"}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <IconCalendarSearch />
                  <Box p={10}>行事曆</Box>
                </Button>
              </NavLink>
            </Stack>
            <Flex>
              <Button
                variant="light"
                color="orange"
                radius="md"
                fullWidth={true}
                onClick={() => {
                  localStorage.removeItem("token");
                  queryClient.clear();
                  navigate("login");
                }}
              >
                <IconLogout />
                <Box p={5}>登出</Box>
              </Button>
            </Flex>
          </Flex>
        </Stack>
      ) : (
        <Box w={25} onClick={() => setIsNavBoardOpen(true)}>
          <IconChevronRight style={{ marginTop: "12px" }} />
        </Box>
      )}
    </>
  );
}

export default NavBoard;
