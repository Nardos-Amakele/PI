"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

interface TextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color, TextAlign.configure({ types: ["heading", "paragraph"] })],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl w-full min-h-[150px] border border-gray-300 rounded-md p-3 bg-white",
      },
    },
      immediatelyRender: false,
  }
);

  if (!editor) return null;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded">I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 border rounded">U</button>
        {/* <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="px-2 py-1 border rounded">H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 border rounded">H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded">• List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 border rounded">1. List</button> */}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
