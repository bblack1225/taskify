import { Modal } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export const TaskCardModal = () => {
  const navigate = useNavigate();
  return (
    <Modal opened={true} onClose={() => navigate(-1)}>
      123
    </Modal>
  );
};
