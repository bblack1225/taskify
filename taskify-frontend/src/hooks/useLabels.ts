import { getAllLabels } from "@/api/labels";
import { useQuery } from "@tanstack/react-query";

function useLabels(boardId: string) {
  return useQuery({
    queryKey: ["labels"],
    queryFn: () => getAllLabels(boardId),
    initialData: [],
  });
}

export default useLabels;
