import { TaskLabel } from "@/types/labels";
import { createContext, useContext } from "react";

export const LabelsContext = createContext<TaskLabel[]>([]);

export const useLabelsData = () => {
  return useContext(LabelsContext);
};
