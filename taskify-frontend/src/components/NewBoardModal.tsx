import { Button, Modal, Textarea } from "@mantine/core";
import { useState } from "react";

type Props = {
  opened: boolean;
  close: () => void;
  onAddBoard: (cardText: string) => void;
};
function NewBoardModal({ opened, close, onAddBoard }: Props) {
  const [titleText, setTitleText] = useState("");

  const handleAddCard = () => {
    if (titleText) {
      onAddBoard(titleText);
      setTitleText("");
      close();
    } else return;
  };

  return (
    <Modal opened={opened} onClose={close} title="+ 新增列表">
      <Textarea
        value={titleText}
        onChange={(e) => setTitleText(e.target.value)}
        placeholder="為列表輸入標題"
      />
      <Button mt={16} color="#53a8b6" onClick={handleAddCard}>
        新增列表
      </Button>
    </Modal>
  );
}

export default NewBoardModal;
