import { getAllLabels } from "@/api/labels";
import { useQuery } from "@tanstack/react-query";

function useLabels(boardId: string) {
  return useQuery({
    queryKey: ["labels"],
    queryFn: () => getAllLabels(boardId),
  });
}

export default useLabels;
