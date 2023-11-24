import useLabels from "@/hooks/useLabels";
import { TaskLabel } from "@/types/labels";
import { createContext, useContext } from "react";

const LabelsContext = createContext<TaskLabel[] | []>([]);

type Props = {
  boardId: string;
  children: React.ReactNode;
};

export const useLabelsData = () => {
  return useContext(LabelsContext);
};

export const LabelsProvider = ({ boardId, children }: Props) => {
  const { data: labels = [] } = useLabels(boardId);
  return (
    <LabelsContext.Provider value={labels}>{children}</LabelsContext.Provider>
  );
};
