import { TaskLabel } from "@/types/labels";
import { createContext, useContext } from "react";

const LabelsContext = createContext<Map<string, TaskLabel>>(
  new Map<string, TaskLabel>()
);

export const useLabelsData = () => {
  return useContext(LabelsContext);
};

// TODO 想改名稱
export const LabelsComponent = LabelsContext.Provider;
