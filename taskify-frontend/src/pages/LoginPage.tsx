import {
  Box,
  Button,
  CopyButton,
  Flex,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import style from "./LoginPage.module.scss";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useForm } from "@mantine/form";
function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (resData) => {
      localStorage.setItem("token", resData.token);
      const redirectTo = location.state ? location.state.from.to : "/board";
      navigate(redirectTo);
    },
    onError: () => {
      form.setErrors({ password: "Email或密碼錯誤" });
    },
  });

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => {
        if (/^\S+@\S+$/.test(value)) {
          return null;
        } else {
          if (value.length === 0) {
            return "請輸入Email";
          } else {
            return "無效的Email";
          }
        }
      },
      password: (value) => (value.length > 0 ? null : "請輸入密碼"),
    },
  });
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={"/board"} replace />;
  }

  return (
    <Flex className={style.loginPageContainer}>
      <Flex className={style.layerContainer}>
        <div className={style.layer}>SIMPLIFY YOUR DAY</div>
      </Flex>
      <form
        className={style.loginMain}
        onSubmit={form.onSubmit((value) => loginMutation.mutate(value))}
      >
        <Box
          className={style.loginText}
          style={{ fontSize: "32px", fontWeight: "bold" }}
        >
          Taskify
        </Box>
        <Text className={style.loginText} style={{ fontSize: "16px" }}>
          登入以繼續
        </Text>
        <TextInput
          placeholder="輸入您的電子郵件"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          placeholder="輸入密碼"
          {...form.getInputProps("password")}
        />
        <Button className={style.loginButton} type="submit">
          登入
        </Button>

        <Flex direction={"column"} style={{ marginTop: "50px", gap: "10px" }}>
          <Flex justify={"space-between"} align={"center"}>
            <Flex>
              <Text c={"dimmed"} style={{ fontSize: "14px" }}>
                測試帳號：user1@example.com
              </Text>
            </Flex>
            <Flex>
              <CopyButton value="user1@example.com">
                {({ copied, copy }) => (
                  <Button
                    w={100}
                    h={30}
                    color={copied ? "teal" : "yellow"}
                    onClick={copy}
                  >
                    {copied ? "複製成功" : "複製帳號"}
                  </Button>
                )}
              </CopyButton>
            </Flex>
          </Flex>
          <Text c={"dimmed"} style={{ fontSize: "14px" }}>
            測試密碼：user
          </Text>
        </Flex>

        {/* </form> */}
        {/* <Text className={style.loginText} style={{ fontSize: "12px" }}>
          或是
        </Text>
        <Button className={style.loginButton}>使用Google登入</Button>
        <Flex justify={"space-evenly"}>
          <a href="">無法登入？</a>
          <a href="">建立帳戶</a>
        </Flex> */}
      </form>
    </Flex>
  );
}

export default LoginPage;
