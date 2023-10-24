import { Button, Modal, Textarea } from "@mantine/core";
import { useState } from "react";

type Props = {
  opened: boolean;
  close: () => void;
  onAddCard: (cardText: string) => void;
};
function NewCardModal({ opened, close, onAddCard }: Props) {
  const [cardText, setCardText] = useState("");

  const handleAddCard = () => {
    if (cardText) {
      onAddCard(cardText);
      setCardText("");
      close();
    } else return;
  };

  return (
    <Modal opened={opened} onClose={close} title="+ 新增卡片">
      <Textarea
        value={cardText}
        onChange={(e) => setCardText(e.target.value)}
        placeholder="為這張卡片輸入標題"
      />
      <Button mt={16} color="#53a8b6" onClick={handleAddCard}>
        新增卡片
      </Button>
    </Modal>
  );
}

export default NewCardModal;
