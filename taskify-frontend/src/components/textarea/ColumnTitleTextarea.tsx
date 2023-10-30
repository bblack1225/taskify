import { Textarea, TextareaProps as MantineTextareaProps } from "@mantine/core";
import { useState } from "react";
import style from "./ColumnTitleTextarea.module.scss";
export interface Props extends MantineTextareaProps {
  id: string;
  title: string;
  onSave: (id: string, value: string) => void;
}

// TODO 可能會需要再建立一個抽象的textarea用到 forwardRef
const ColumnTitleTextarea = ({ id, title, onSave, ...props }: Props) => {
  const [editTitle, setEditTitle] = useState(title);
  const [isComposing, setIsComposing] = useState(false);

  const handleBlur = () => {
    const trimmedTitle = editTitle.trim();
    setEditTitle(trimmedTitle);
    if (title !== trimmedTitle) {
      onSave(id, trimmedTitle);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };
  return (
    <Textarea
      className={style.taskTitle}
      value={editTitle}
      autosize
      onKeyDown={(e) => handleKeyDown(e)}
      onBlur={handleBlur}
      onChange={(e) => setEditTitle(e.target.value)}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
      {...props}
    />
  );
};

export default ColumnTitleTextarea;
