import { useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";

export default function CodeEditor({ ...props }) {
  const formatTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      clearFormatTimeout();
    };
  }, []);

  const clearFormatTimeout = () => {
    if (formatTimeoutRef.current) {
      clearTimeout(formatTimeoutRef.current);
      formatTimeoutRef.current = null;
    }
  };

  const handleEditorMount = (editor) => {
    clearFormatTimeout();

    formatTimeoutRef.current = setTimeout(() => {
      editor.getAction("editor.action.formatDocument")?.run();
    }, 300);
  };

  return (
    <div className="relative h-full">
      <Editor theme={"vs-dark"} onMount={handleEditorMount} {...props} />
    </div>
  );
}
