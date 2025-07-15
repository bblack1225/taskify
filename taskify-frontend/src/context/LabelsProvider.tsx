import useLabels from "@/hooks/useLabels";
import { LabelsContext } from "./useLabelsData";

type Props = {
  children: React.ReactNode;
  boardId: string;
};

export const LabelsProvider = ({ children, boardId }: Props) => {
  const { data: labels = [], isPending } = useLabels(boardId);
  if (isPending) {
    return null;
  }

  return (
    <LabelsContext.Provider value={labels}>{children}</LabelsContext.Provider>
  );
};
