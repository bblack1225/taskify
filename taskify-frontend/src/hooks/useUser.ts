import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

export function useUser() {
  return useContext(UserContext);
}
