"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
  Redo,
  Undo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading,
  Palette,
  Highlighter,
  Code,
  Quote,
  Minus,
  Table2,
  TableCellsMerge,
  Trash2,
  Plus,
  Minus as MinusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const TextEditor = ({
  value,
  onChange,
  error,
  dir,
  maxLength,
}: {
  value: string;
  onChange: (val: string, stringValue: string) => void;
  error?: string;
  dir?: "rtl" | "ltr";
  maxLength?: number;
}) => {
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [url, setUrl] = useState("");
  const commonT = useTranslations("dashboard.common");
  const [anchorElTextColor, setAnchorElTextColor] =
    useState<null | HTMLElement>(null);
  const [anchorElHighlight, setAnchorElHighlight] =
    useState<null | HTMLElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "link" } }),
      Image.configure({ inline: true, allowBase64: true }),
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: "tiptap-table" },
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ["paragraph", "heading"],
        alignments: ["left", "center", "right"],
      }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Highlight.configure({ multicolor: true }),
      CodeBlock,
      Blockquote,
      HorizontalRule,
    ],
    content: value,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      const textContent = editor.getText();
      if (maxLength && textContent.length > maxLength) {
        const truncatedText = textContent.substring(0, maxLength);
        editor.commands.setContent(
          editor.getHTML().replace(textContent, truncatedText)
        );
        return;
      }
      onChange(textContent, editor.getHTML());
    };

    editor.on("update", handleChange);

    return () => {
      editor.off("update", handleChange);
    };
  }, [editor, onChange, maxLength]);

  // Sync editor content when value prop changes
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (value !== currentHTML && value !== undefined) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  const getTextFromHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };
  const characterCount =
    editor?.getText().length || getTextFromHtml(value).length || 0;
  const remainingChars = maxLength ? maxLength - characterCount : null;
  const isOverLimit = maxLength && characterCount > maxLength;

  const handleOpenLinkDialog = () => setOpenLinkDialog(true);
  const handleCloseLinkDialog = () => {
    setOpenLinkDialog(false);
    setUrl("");
  };
  const handleAddLink = () => {
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
    handleCloseLinkDialog();
  };

  const handleOpenImageDialog = () => setOpenImageDialog(true);
  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setUrl("");
  };
  const handleAddImage = () => {
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
    handleCloseImageDialog();
  };

  const setHeading = (level: number) => {
    editor
      ?.chain()
      .focus()
      .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
      .run();
  };

  const handleOpenTextColor = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTextColor(event.currentTarget);
  };
  const handleCloseTextColor = () => {
    setAnchorElTextColor(null);
  };
  const handleTextColorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const color = event.target.value;
    editor?.chain().focus().setColor(color).run();
    editor?.chain().focus().setColor(color).run();
  };

  const handleOpenHighlight = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElHighlight(event.currentTarget);
  };
  const handleCloseHighlight = () => {
    setAnchorElHighlight(null);
  };
  const handleHighlightChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const color = event.target.value;
    editor?.chain().focus().toggleHighlight({ color }).run();
  };

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "rounded-lg border",
          error ? "border-red-500" : "border-gray-300"
        )}
      >
        <div
          className={cn(
            "flex flex-wrap items-center gap-2 rounded-t-lg border-b bg-white p-2",
            error ? "border-red-500" : "border-gray-300"
          )}
        >
          <div className="flex gap-1">
            <Button
              variant="ghost"
              type="button"
              size="icon"
              className={cn(
                "h-6 w-6",
                editor.isActive("bold") && "bg-gray-100 text-gray-900"
              )}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-6 w-6",
                editor.isActive("italic") && "bg-gray-100 text-gray-900"
              )}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-6 w-6",
                editor.isActive("underline") && "bg-gray-100 text-gray-900"
              )}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-4 w-px bg-gray-300" />

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-6 w-6",
                editor.isActive("bulletList") && "bg-gray-100 text-gray-900"
              )}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title={commonT("Bullet List")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-6 w-6",
                editor.isActive("orderedList") && "bg-gray-100 text-gray-900"
              )}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title={commonT("Numbered List")}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-6 w-6"
              onClick={() =>
                editor.chain().focus().sinkListItem("listItem").run()
              }
              disabled={!editor.can().sinkListItem("listItem")}
              title={commonT("Indent List Item")}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-6 w-6"
              onClick={() =>
                editor.chain().focus().liftListItem("listItem").run()
              }
              disabled={!editor.can().liftListItem("listItem")}
              title={commonT("Outdent List Item")}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-4 w-px bg-gray-300" />

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-6 w-6",
                editor.isActive({ textAlign: "left" }) &&
                "bg-gray-100 text-gray-900"
              )}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-6 w-6",
                editor.isActive({ textAlign: "center" }) &&
                "bg-gray-100 text-gray-900"
              )}
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-6 w-6",
                editor.isActive({ textAlign: "right" }) &&
                "bg-gray-100 text-gray-900"
              )}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-4 w-px bg-gray-300" />

          <div className="flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6",
                    (editor.isActive("heading", { level: 1 }) ||
                      editor.isActive("heading", { level: 2 }) ||
                      editor.isActive("heading", { level: 3 }) ||
                      editor.isActive("heading", { level: 4 }) ||
                      editor.isActive("heading", { level: 5 }) ||
                      editor.isActive("heading", { level: 6 })) &&
                    "bg-gray-100 text-gray-900"
                  )}
                >
                  <Heading className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setHeading(1)}
                  className={
                    editor.isActive("heading", { level: 1 })
                      ? "bg-gray-100"
                      : ""
                  }
                >
                  {commonT("Heading 1")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setHeading(2)}
                  className={
                    editor.isActive("heading", { level: 2 })
                      ? "bg-gray-100"
                      : ""
                  }
                >
                  {commonT("Heading 2")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setHeading(3)}
                  className={
                    editor.isActive("heading", { level: 3 })
                      ? "bg-gray-100"
                      : ""
                  }
                >
                  {commonT("Heading 3")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setHeading(4)}
                  className={
                    editor.isActive("heading", { level: 4 })
                      ? "bg-gray-100"
                      : ""
                  }
                >
                  {commonT("Heading 4")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setHeading(5)}
                  className={
                    editor.isActive("heading", { level: 5 })
                      ? "bg-gray-100"
                      : ""
                  }
                >
                  {commonT("Heading 5")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setHeading(6)}
                  className={
                    editor.isActive("heading", { level: 6 })
                      ? "bg-gray-100"
                      : ""
                  }
                >
                  {commonT("Heading 6")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor?.chain().focus().setParagraph().run()}
                  className={editor.isActive("paragraph") ? "bg-gray-100" : ""}
                >
                  {commonT("Paragraph")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-6 w-6"
                  onClick={handleOpenTextColor}
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-28 p-2">
                <input
                  type="color"
                  defaultValue={
                    editor?.getAttributes("textStyle")?.color || "#000000"
                  }
                  onChange={handleTextColorChange}
                  className="h-10 w-full border-none"
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className={cn(
                    "h-6 w-6",
                    editor.isActive("highlight") && "bg-gray-100 text-gray-900"
                  )}
                  onClick={handleOpenHighlight}
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-28 p-2">
                <input
                  type="color"
                  defaultValue={
                    editor?.getAttributes("highlight")?.color || "#ffffff"
                  }
                  onChange={handleHighlightChange}
                  className="h-10 w-full border-none"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="h-4 w-px bg-gray-300" />

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-6 w-6",
                editor.isActive("link") && "bg-gray-100 text-gray-900"
              )}
              onClick={handleOpenLinkDialog}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-6 w-6"
              onClick={handleOpenImageDialog}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-6 w-6",
                editor.isActive("table") && "bg-gray-100 text-gray-900"
              )}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
            >
              <TableIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-6 w-6"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              disabled={!editor.can().addRowAfter()}
              title={commonT("Add Row After")}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-6 w-6"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              disabled={!editor.can().addColumnAfter()}
              title={commonT("Add Column After")}
            >
              <TableCellsMerge className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-6 w-6"
              onClick={() => editor.chain().focus().deleteRow().run()}
              disabled={!editor.can().deleteRow()}
              title={commonT("Delete Row")}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-6 w-6"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              disabled={!editor.can().deleteColumn()}
              title={commonT("Delete Column")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-6 w-6"
              onClick={() => editor.chain().focus().deleteTable().run()}
              disabled={!editor.can().deleteTable()}
              title={commonT("Delete Table")}
            >
              <Table2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-4 w-px bg-gray-300" />

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-6 w-6",
                editor.isActive("codeBlock") && "bg-gray-100 text-gray-900"
              )}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-6 w-6",
                editor.isActive("blockquote") && "bg-gray-100 text-gray-900"
              )}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-6 w-6"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-4 w-px bg-gray-300" />

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-6 w-6"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-6 w-6"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <EditorContent
          editor={editor}
          className={cn(
            "tiptap h-[150px] max-h-[400px] min-h-[150px] overflow-auto rounded-b-lg bg-gray-50 p-2",
            dir === "rtl" ? "prose-rtl" : "prose-ltr",
            isOverLimit && "border-red-500"
          )}
          dir={dir}
        />
        {maxLength && (
          <div
            className={cn(
              "px-2 py-1 text-xs text-right",
              isOverLimit ? "text-red-500" : "text-gray-500"
            )}
          >
            {remainingChars !== null && (
              <span>
                {remainingChars >= 0
                  ? `${commonT(
                    "Characters remaining"
                  )}: ${remainingChars} ${commonT("characters")}`
                  : `${Math.abs(remainingChars)} ${commonT(
                    "characters"
                  )} over limit`}
              </span>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="ms-3 mt-1 text-xs font-medium text-red-500">{error}</p>
      )}

      <Dialog open={openLinkDialog} onOpenChange={setOpenLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{commonT("Enter URL")}</DialogTitle>
          </DialogHeader>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={commonT("Enter URL")}
            className="mt-2"
          />
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseLinkDialog}>
              {commonT("Cancel")}
            </Button>
            <Button onClick={handleAddLink}>{commonT("Add Link")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{commonT("Enter Image URL")}</DialogTitle>
          </DialogHeader>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={commonT("Enter Image URL")}
            className="mt-2"
          />
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseImageDialog}>
              {commonT("Cancel")}
            </Button>
            <Button onClick={handleAddImage}>{commonT("Add Image")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TextEditor;
