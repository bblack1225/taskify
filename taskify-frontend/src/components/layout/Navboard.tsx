import { Box, Button, Flex, Stack } from "@mantine/core";
import Avatar from "/public/lazy.png";
import {
  IconAlignBoxBottomCenter,
  IconCalendarSearch,
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
} from "@tabler/icons-react";

import style from "./NavBoard.module.scss";
import {  NavLink, useNavigate } from "react-router-dom";
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
        <Stack p={20} h={"100vh"}>
          <Box>
            <Flex justify={"space-between"} align={"center"} mb={20}>
              <Flex className={style.navTitle}>{userInfo.name}</Flex>
              <IconChevronLeft
                style={{ cursor: "pointer" }}
                onClick={() => setIsNavBoardOpen(false)}
              />
            </Flex>
            <img
              style={{ marginTop: "10px" }}
              src={Avatar}
              alt="萬聖節快樂"
              width={"200px"}
            />
          </Box>
          <Flex style={{flex:1}} direction={"column"} justify={"space-between"}>
            <Stack pt={10}>
              <NavLink
                to="/board"
                className={({ isActive}) =>  isActive ? style.active : ''}
              >
                <Button color="#be3144" w={"200px"}>
                  <IconAlignBoxBottomCenter />
                  <Box p={5}>看板</Box>
                </Button>
              </NavLink>
              {/* <Button color="#d55b3e">
                <IconUsers />
                <Box p={5}>成員</Box>
              </Button> */}
              <NavLink
                to="/calendar"
                className={({ isActive}) =>  isActive ? style.active : ''}
             
              >
                <Button color="#be3144" w={"200px"}>
                  <IconCalendarSearch />
                  <Box p={5}>行事曆</Box>
                </Button>
              </NavLink>
              {/* <Button color="#d55b3e">
                <IconHeartDown />
                <Box p={5}>你的看板</Box>
              </Button> */}
            </Stack>
            <Flex>
              <Button
                fullWidth={true}
                variant="gradient"
                gradient={{
                  from: "rgba(255, 171, 171, 1)",
                  to: "rgba(145, 199, 255, 1)",
                  deg: 300,
                }}
                onClick={() => {
                  localStorage.removeItem("token");
                  queryClient.clear();
                  navigate('login')
                }}
              >
                <IconLogout />
                <Box p={5}>登出</Box>
              </Button>
            </Flex>
          </Flex>
        </Stack>
      ) : (
        <Box w={25}>
          <IconChevronRight
            style={{ cursor: "pointer", marginTop: "22px" }}
            onClick={() => setIsNavBoardOpen(true)}
          />
        </Box>
      )}
    </>
  );
}

export default NavBoard;
