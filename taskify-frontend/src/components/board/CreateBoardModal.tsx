import {
  Modal,
  TextInput,
  Textarea,
  Flex,
  Button,
  Text,
  Popover,
  SimpleGrid,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useState } from "react";

// 預設的背景顏色選項
const BG_COLORS = [
  "#E8F9FD",
  "#E3FDFD",
  "#E3F6F5",
  "#F8F3EB",
  "#FDF6EC",
  "#FEF9E7",
  "#F5F0FF",
  "#F0F4FF",
  "#E8F3FF",
  "#E3F2FD",
  "#E8F5E9",
  "#F1F8E9",
  "#FFF8E1",
  "#FFF3E0",
  "#FBE9E7",
  "#F3E5F5",
  "#F1F8FF",
  "#E8F5FF",
  "#E1F5FE",
  "#E0F7FA",
];

interface CreateBoardModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    description: string;
    icon: string;
    themeColor: string;
  }) => void;
}

export function CreateBoardModal({
  opened,
  onClose,
  onSubmit,
}: CreateBoardModalProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const theme = useMantineTheme();

  const form = useForm<{
    name: string;
    description: string;
    icon: string;
    themeColor: string;
  }>({
    initialValues: {
      name: "",
      description: "",
      icon: "1f4cb",
      themeColor: "#E8F9FD",
    },
    validate: {
      name: (value: string) => (!value.trim() ? "請輸入看板標題" : null),
    },
  });

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    form.setFieldValue("icon", emojiData.unified);
    setShowEmojiPicker(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="建立新看板"
      size="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          console.log("values", values);
          onSubmit(values);
          // form.reset();
        })}
      >
        <TextInput
          label="看板標題"
          placeholder="輸入看板標題"
          mb="md"
          required
          {...form.getInputProps("name")}
        />

        <Textarea
          label="描述"
          placeholder="新增描述（選填）"
          mb="md"
          autosize
          minRows={2}
          maxRows={4}
          {...form.getInputProps("description")}
        />

        <div style={{ marginBottom: theme.spacing.md }}>
          <Text size="sm" fw={500} mb={8}>
            選擇表情符號 <span style={{ color: "#FA5252" }}>*</span>
          </Text>
          <Popover
            opened={showEmojiPicker}
            onChange={setShowEmojiPicker}
            position="bottom"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Button
                variant="outline"
                onClick={() => setShowEmojiPicker((o) => !o)}
              >
                選擇表情符號
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <div style={{ width: "100%", maxWidth: "350px" }}>
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width="100%"
                  height={350}
                  previewConfig={{
                    showPreview: false,
                  }}
                  searchDisabled={false}
                  skinTonesDisabled={true}
                />
              </div>
            </Popover.Dropdown>
          </Popover>
        </div>

        <div style={{ marginBottom: theme.spacing.md }}>
          <Text size="sm" fw={500} mb={8}>
            選擇背景顏色 <span style={{ color: "#FA5252" }}>*</span>
          </Text>
          <SimpleGrid cols={8} spacing="xs">
            {BG_COLORS.map((color) => (
              <Box
                key={color}
                onClick={() => form.setFieldValue("themeColor", color)}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  backgroundColor: color,
                  borderRadius: theme.radius.sm,
                  cursor: "pointer",
                  border:
                    form.values.themeColor === color
                      ? `2px solid ${theme.colors.blue[5]}`
                      : "1px solid var(--mantine-color-gray-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.2s",
                  },
                }}
              >
                {form.values.themeColor === color &&
                  String.fromCodePoint(parseInt(form.values.icon, 16))}
              </Box>
            ))}
          </SimpleGrid>
        </div>

        <Flex justify="space-between" mt="xl">
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" leftSection={<IconPlus size={18} />}>
            建立看板
          </Button>
        </Flex>
      </form>
    </Modal>
  );
}
