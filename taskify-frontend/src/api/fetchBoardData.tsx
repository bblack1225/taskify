import { AllDataResType } from "@/components/TaskColumn"
import axios from "axios"

export const fetchBoardData = async (id: string): Promise<AllDataResType> => {
  return await axios.get(`/api/statusCol/all/${id}`).then((res) => res.data)
}
