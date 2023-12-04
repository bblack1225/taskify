import { Box, Button, Flex, Input, MantineProvider, Text } from "@mantine/core";
import style from "./LoginPage.module.scss";

function LoginPage() {
  return (
    <MantineProvider>
      <Flex className={style.loginPageContainer}>
        <Flex className={style.layerContainer}>
          <div className={style.layer}>TODO LIST</div>
        </Flex>
        <Flex direction={"column"} className={style.loginMain}>
          <Box
            className={style.loginText}
            style={{ fontSize: "32px", fontWeight: "bold" }}
          >
            Taskify
          </Box>
          <Text className={style.loginText} style={{ fontSize: "16px" }}>
            登入以繼續
          </Text>
          <Input placeholder="輸入您的電子郵件" />
          <Button className={style.loginButton}>繼續</Button>
          <Text className={style.loginText} style={{ fontSize: "12px" }}>
            或是
          </Text>
          <Button className={style.loginButton}>使用Google登入</Button>
          <Flex justify={"space-evenly"}>
            <a href="">無法登入？</a>
            <a href="">建立帳戶</a>
          </Flex>
        </Flex>
      </Flex>
    </MantineProvider>
  );
}

export default LoginPage;
