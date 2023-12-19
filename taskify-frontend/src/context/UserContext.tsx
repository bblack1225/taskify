import { getUserInfo } from "@/api/user";
import { UserInfo } from "@/types/user";
import { Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

export const UserContext = createContext<UserInfo>({
  id: "",
  email: "",
  name: "",
  boardId: "",
  boardName: "",
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: userInfo, isPending } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    // user info is not going to change often
    staleTime: 1000 * 60 * 60 * 24,
    throwOnError: true,
  });

  if (isPending) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader color="blue" type="bars" />
      </div>
    );
  }

  if (!userInfo) {
    throw new Error("User info is not found");
  }

  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
};
