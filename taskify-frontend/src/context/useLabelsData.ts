import { TaskLabel } from "@/types/labels";
import { createContext, useContext } from "react";

const LabelsContext = createContext<Map<string, TaskLabel>>(
  new Map<string, TaskLabel>()
);

export const useLabelsData = () => {
  return useContext(LabelsContext);
};

export const LabelsComponent = LabelsContext.Provider;
