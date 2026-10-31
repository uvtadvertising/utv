"use client";

import { useRef } from "react";
import { uploadBlogImage } from "@/lib/blog-images";

type RichEditorProps = {
  onChange: (html: string) => void;
};

function ToolbarButton({
  onClick,
  children,
  title,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted transition hover:bg-white/5 hover:text-foreground"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-card-border" aria-hidden />;
}

export function RichEditor({ onChange }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function sync() {
    onChange(editorRef.current?.innerHTML || "");
  }

  function run(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    sync();
  }

  function insertHeading(level: 2 | 3) {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, `h${level}`);
    sync();
  }

  function insertLink() {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    run("createLink", url);
  }

  async function onPickImage(file: File | undefined) {
    if (!file || !editorRef.current) return;

    try {
      const url = await uploadBlogImage(file, "content");
      editorRef.current.focus();
      document.execCommand(
        "insertHTML",
        false,
        `<p><img src="${url}" alt="" /></p>`,
      );
      sync();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Image upload failed.");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-card-border bg-navy/40">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-card-border px-2 py-2">
        <ToolbarButton title="Bold" onClick={() => run("bold")}>
          Bold
        </ToolbarButton>
        <ToolbarButton title="Italic" onClick={() => run("italic")}>
          Italic
        </ToolbarButton>
        <ToolbarButton title="Underline" onClick={() => run("underline")}>
          Underline
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" onClick={() => run("strikeThrough")}>
          Strike
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Heading 2" onClick={() => insertHeading(2)}>
          H2
        </ToolbarButton>
        <ToolbarButton title="Heading 3" onClick={() => insertHeading(3)}>
          H3
        </ToolbarButton>
        <ToolbarButton title="Paragraph" onClick={() => run("formatBlock", "p")}>
          P
        </ToolbarButton>
        <ToolbarButton title="Quote" onClick={() => run("formatBlock", "blockquote")}>
          Quote
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Align left" onClick={() => run("justifyLeft")}>
          Left
        </ToolbarButton>
        <ToolbarButton title="Align center" onClick={() => run("justifyCenter")}>
          Center
        </ToolbarButton>
        <ToolbarButton title="Align right" onClick={() => run("justifyRight")}>
          Right
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Bullet list" onClick={() => run("insertUnorderedList")}>
          List
        </ToolbarButton>
        <ToolbarButton title="Numbered list" onClick={() => run("insertOrderedList")}>
          Numbered
        </ToolbarButton>
        <ToolbarButton title="Insert link" onClick={insertLink}>
          Link
        </ToolbarButton>
        <ToolbarButton title="Horizontal line" onClick={() => run("insertHorizontalRule")}>
          Line
        </ToolbarButton>
        <ToolbarButton title="Insert image" onClick={() => fileInputRef.current?.click()}>
          Image
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Undo" onClick={() => run("undo")}>
          Undo
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => run("redo")}>
          Redo
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            onPickImage(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        className="rich-editor min-h-[320px] px-4 py-3 text-sm leading-relaxed text-foreground outline-none [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-3 [&_blockquote]:text-muted [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-bold [&_hr]:my-4 [&_hr]:border-card-border [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-xl [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
      />
    </div>
  );
}
