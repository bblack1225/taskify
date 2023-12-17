import useLabels from "@/hooks/useLabels";
import { LabelsContext } from "./useLabelsData";
import { useUser } from "@/hooks/useUser";

type Props = {
  children: React.ReactNode;
};

export const LabelsProvider = ({ children }: Props) => {
  const userInfo = useUser();
  
  const { data: labels = [], isPending } = useLabels(userInfo.boardId);
  if (isPending) {
    return null;
  }

  return (
    <LabelsContext.Provider value={labels}>{children}</LabelsContext.Provider>
  );
};
