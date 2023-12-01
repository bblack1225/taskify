import useLabels from "@/hooks/useLabels";
import { LabelsContext } from "./useLabelsData";

type Props = {
  boardId: string;
  children: React.ReactNode;
};

export const LabelsProvider = ({ boardId, children }: Props) => {
  const { data: labels = [], isPending } = useLabels(boardId);
  if (isPending) {
    return null;
  }

  return (
    <LabelsContext.Provider value={labels}>{children}</LabelsContext.Provider>
  );
};
