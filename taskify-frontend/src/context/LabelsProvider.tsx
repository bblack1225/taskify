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

  //new Map : [key, value]
  const labelsMap = new Map(labels.map((label) => [label.id, label]));

  return (
    <LabelsContext.Provider value={labelsMap}>
      {children}
    </LabelsContext.Provider>
  );
};
