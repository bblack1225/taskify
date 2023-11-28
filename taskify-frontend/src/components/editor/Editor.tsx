import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Button, Flex } from "@mantine/core";

// import axios from "axios";
// import axiosClient from "@/api/axiosClient";
// import Superscript from "@tiptap/extension-superscript";
// import SubScript from "@tiptap/extension-subscript";

// const content = '<h2 style="text-align: center;">Welcome to Taskify</h2>';
type Props = {
  description: string;
  onSave: (description: string) => void;
  setEditTaskDes: (value: boolean) => void;
};

function Editor({ description, onSave, setEditTaskDes }: Props) {
  console.log("description", description);
  console.log("content!!", JSON.parse(description));

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: description ? JSON.parse(description) : "",
  });

  const handleSave = async () => {
    const json = editor?.getJSON();
    console.log("json", json);
    const jsonContent = JSON.stringify(json);
    console.log("jsonContent", jsonContent);
    onSave(jsonContent);
    setEditTaskDes(false);
  };

  return (
    <>
      <RichTextEditor w={525} mt={10} editor={editor}>
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
          {/* 
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup> */}
          {/* 
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup> */}
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
      <Flex gap={15}>
        <Button w={100} mt={10} onClick={handleSave}>
          save
        </Button>
        <Button
          color="gray"
          w={100}
          mt={10}
          onClick={() => setEditTaskDes(false)}
        >
          取消
        </Button>
      </Flex>
    </>
  );
}

export default Editor;
