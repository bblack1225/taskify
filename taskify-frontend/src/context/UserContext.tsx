import { getUserInfo } from "@/api/user";
import { UserInfo } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

export const UserContext = createContext<UserInfo | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: userInfo, isPending } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    // user info is not going to change often
    staleTime: 1000 * 60 * 60 * 24,
    throwOnError: true,
  });

  if (isPending) {
    return null;
  }

  if (!userInfo) {
    throw new Error("userInfo is null");
  }

  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
};
