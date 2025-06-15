import { getBaseData } from "@/api/column";
import { useQuery } from "@tanstack/react-query";

export const useTasks = (boardId: string) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => getBaseData(boardId),
    throwOnError: true,
  });
};
