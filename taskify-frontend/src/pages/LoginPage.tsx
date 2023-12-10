import { Box, Button, Flex, Input, MantineProvider, Text } from "@mantine/core";
import style from "./LoginPage.module.scss";
import { useLocation, useNavigate } from "react-router-dom";

const MOCK_TOKEN = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJibGFjazYwMTM3QGdtYWlsLmNvbSIsImV4cCI6MTcwMjc5MTAwNH0.J4KDh6obQ_wv1v9GvDJqru_kM8EoIfSIeUop_-zL5JCuvpsqo0f_KaUnn1nJ041H';
function LoginPage() {
      const location = useLocation();
      const navigate = useNavigate();
    console.log('location in login',location);
  // const router = useRouter();
  // console.log('router',router);
  const handleLogin = () => {

    
    // const { search } = router.latestLocation;
    // console.log('latestLocation',latestLocation);
    
    localStorage.setItem('token', MOCK_TOKEN);
    const redirectTo = location.state ? location.state.from.to : '/board';
    navigate(redirectTo)
    // router.history.push(search.redirect)
  }
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
          <Input placeholder="輸入密碼" />
          <Button className={style.loginButton} onClick={handleLogin}>登入</Button>
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
