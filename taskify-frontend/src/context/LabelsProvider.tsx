import useLabels from "@/hooks/useLabels";
import { LabelsComponent } from "./useLabelsData";

type Props = {
  boardId: string;
  children: React.ReactNode;
};

export const LabelsProvider = ({ boardId, children }: Props) => {
  const { data: labels = [] } = useLabels(boardId);
  const labelsMap = new Map(labels.map((label) => [label.id, label]));
  return <LabelsComponent value={labelsMap}>{children}</LabelsComponent>;
};