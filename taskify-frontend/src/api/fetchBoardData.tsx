import axios from "axios";

export const fetchBoardData = async (id: string) => {
  return await axios.get(`/api/statusCol/all/${id}`).then((res) => res.data);
};
