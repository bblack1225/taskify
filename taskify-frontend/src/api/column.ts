import axios from 'axios'
export const addColumns = async(requestData: {boardId: string, title: string, dataIndex: number}) => {
    return await axios.post('/api/statusCol', requestData);
}