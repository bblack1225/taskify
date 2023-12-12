import {
  Box,
  Button,
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
      // TODO set to auth context
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
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length > 0 ? null : "Password is required"),
    },
  });
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={"/board"} replace />;
  }

  return (
    <Flex className={style.loginPageContainer}>
      <Flex className={style.layerContainer}>
        <div className={style.layer}>TODO LIST</div>
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
        {/* </form> */}
        <Text className={style.loginText} style={{ fontSize: "12px" }}>
          或是
        </Text>
        <Button className={style.loginButton}>使用Google登入</Button>
        <Flex justify={"space-evenly"}>
          <a href="">無法登入？</a>
          <a href="">建立帳戶</a>
        </Flex>
      </form>
    </Flex>
  );
}

export default LoginPage;
