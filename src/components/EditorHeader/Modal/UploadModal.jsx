import { useState, useRef } from "react";
import { Modal, Button, Toast } from "@douyinfe/semi-ui";
import CodeEditor from "../../CodeEditor";
import { validateJsonDiagram } from "../../../utils/validateSchema";

const initialUploadData = {
  data: null,
  filename: "",
  isValid: false,
  error: null,
};

export default function UploadModal({ visible, setModal, onUpload }) {
  const [uploadData, setUploadData] = useState(initialUploadData);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }

    const file = files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      setUploadData({
        data: null,
        filename: "",
        isValid: false,
        error: "Please select a JSON file",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        const validation = validateJsonDiagram(jsonData);
        const isValid = validation.valid;

        setUploadData({
          data: jsonData,
          filename: file.name.replace(".json", ""),
          isValid,
          error: isValid
            ? null
            : validation.errors && validation.errors[0]
              ? `${validation.errors[0].property}: ${validation.errors[0].detailedMessage || validation.errors[0].message}`
              : "Invalid JSON structure. Please check the file format.",
        });
      } catch (error) {
        console.error("Failed to parse uploaded JSON:", error);
        setUploadData({
          data: null,
          filename: "",
          isValid: false,
          error: "Invalid JSON file. Please check the file format.",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = () => {
    if (uploadData.isValid && uploadData.data) {
      onUpload(uploadData.data);
      setModal(false);
      setUploadData(initialUploadData);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      Toast.success("Diagram uploaded successfully!");
    }
  };

  const handleCancel = () => {
    setModal(false);
    setUploadData(initialUploadData);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const getModalBody = () => {
    return (
      <div className="space-y-4">
        <div>
          <div className="text-sm font-semibold mb-2">Select JSON File:</div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={handleFileInputClick}
            type="button"
            variant="outline"
            className="w-full"
          >
            Choose File
          </Button>
          {uploadData.filename && (
            <div className="text-sm text-gray-600 mt-1">
              Selected: {uploadData.filename}.json
            </div>
          )}
        </div>

        {uploadData.error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
            {uploadData.error}
          </div>
        )}

        {uploadData.data && uploadData.isValid && (
          <div>
            <div className="text-sm font-semibold mb-2">Preview:</div>
            <CodeEditor
              height={300}
              value={JSON.stringify(uploadData.data, null, 2)}
              language="json"
              options={{ readOnly: true }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      title="Upload"
      visible={visible}
      onOk={handleUpload}
      className="drawdb-scope"
      onCancel={handleCancel}
      centered
      closeOnEsc={true}
      okText="Upload"
      okButtonProps={{
        disabled: !uploadData.isValid || !uploadData.data,
      }}
      hasCancel={true}
      cancelText="Cancel"
      width={740}
      bodyStyle={{
        maxHeight: window.innerHeight - 280,
        overflow: "hidden",
        direction: "ltr",
      }}
    >
      {getModalBody()}
    </Modal>
  );
}
