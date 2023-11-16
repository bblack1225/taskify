import { BaseTaskRes, ColumnResType } from "@/types/column";

const BASE_DATA_INDEX = 65536;
export function calculateDataIndex(list: ColumnResType[] | BaseTaskRes[]) {
  if (list.length === 0) {
    return BASE_DATA_INDEX;
  }
  const lastDataIndex = list[list.length - 1].dataIndex;

  return lastDataIndex + BASE_DATA_INDEX;
}
