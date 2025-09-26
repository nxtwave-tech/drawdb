import { useRef } from "react";
import Editor from "./components/Editor/Editor";

export default function App() {
  const editorRef = useRef(null);

  const onSave = (data) => {
    console.log("onSave", data);
  };

  return (
    <>
      <Editor
        ref={editorRef}
        onSave={onSave}
        shouldShowExport={true}
        shouldShowUpload={true}
      />
    </>
  );
}
