import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Button, Flex } from "@mantine/core";
import { useRef, useState } from "react";
import style from "@/components/editor/Editor.module.scss";

type Props = {
  description: string;
  onSave: (description: string) => void;
};

function Editor({ description, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "新增更詳細的敘述..." }),
    ],
    content: description ? JSON.parse(description) : "",
  });

  const prevContentRef = useRef(description);

  const handleSave = async () => {
    const json = editor?.getJSON();
    const jsonContent = JSON.stringify(json);
    prevContentRef.current = JSON.stringify(json);
    // 存description
    onSave(jsonContent);
    // 關閉toolbar
    setIsEditing(false);
  };

  const handleCancel = () => {
    const prevContent = prevContentRef.current;
    //這邊是為了如果prevContent是假值就不會進入if內
    if (prevContent) {
      const prevContentJSON = JSON.parse(prevContent);
      editor?.commands.setContent(prevContentJSON);
    }
    setIsEditing(false);
  };

  return (
    <>
      <RichTextEditor
        w={525}
        mt={10}
        editor={editor}
        style={{ border: isEditing ? "1px solid #ced4da " : "none" }}
        className={!isEditing ? style.editTaskDes : ""}
        onClick={() => {
          if (!isEditing) {
            setIsEditing(true);
            editor?.chain().focus();
          }
        }}
      >
        {isEditing && (
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        )}
        <RichTextEditor.Content style={{ minHeight: "100px" }} />
      </RichTextEditor>
      {isEditing && (
        <Flex gap={15}>
          <Button
            w={100}
            mt={10}
            variant="filled"
            color="orange"
            radius="md"
            onClick={handleSave}
          >
            儲存
          </Button>
          <Button
            w={100}
            mt={10}
            variant="filled"
            color="gray"
            radius="md"
            onClick={handleCancel}
          >
            取消
          </Button>
        </Flex>
      )}
    </>
  );
}

export default Editor;
