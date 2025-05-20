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
import {
  IconLayoutDashboard,
  IconTags,
  IconCalendar,
} from "@tabler/icons-react";

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
        <div className={style.projectDescription}>
          <h1>Taskify</h1>
          <p className={style.tagline}>讓工作更有效率，讓生活更有條理</p>
          <div className={style.features}>
            <div className={style.feature}>
              <IconLayoutDashboard size={24} />
              <Text>清晰直觀的任務管理介面</Text>
            </div>
            <div className={style.feature}>
              <IconTags size={24} />
              <Text>任務標籤分類，快速掌握重點</Text>
            </div>
            <div className={style.feature}>
              <IconCalendar size={24} />
              <Text>可視化行事曆，輕鬆安排任務</Text>
            </div>
          </div>
        </div>

        <form
          className={style.loginMain}
          onSubmit={form.onSubmit((value) => loginMutation.mutate(value))}
        >
          <Text className={style.loginText} style={{ fontSize: "16px" }}>
            登入以繼續
          </Text>
          <TextInput
            placeholder="輸入您的電子郵件"
            radius="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            placeholder="輸入密碼"
            radius="md"
            {...form.getInputProps("password")}
          />
          <Button className={style.loginButton} type="submit">
            登入
          </Button>

          <Flex direction={"column"} style={{ marginTop: "50px", gap: "10px" }}>
            <Flex justify={"space-between"} align={"center"}>
              <Flex>
                <Text
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  style={{ fontSize: "14px" }}
                >
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
            <Text
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
              style={{ fontSize: "14px" }}
            >
              測試密碼：user
            </Text>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
}

export default LoginPage;
