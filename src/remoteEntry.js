import { forwardRef } from "react";
import Editor from "./components/Editor/Editor";
import "./compiled.css";
/**
 * FederatedEditor - A wrapper component for the Editor that can be consumed via Module Federation
 *
 * Props:
 * @param {Object} data - The diagram data containing tables, relationships, and title
 *   Structure: {
 *     tables: Array of table objects with fields, indices, positions, etc.
 *     relationships: Array of relationship objects between tables
 *     title: String - The diagram title (optional, defaults to "Untitled Diagram")
 *   }
 *
 * @param {Function} onSave - Callback function called when the diagram is saved
 *   Parameters: (data) => void
 *   The data parameter contains the complete diagram state as a JSON string
 *
 * @param {boolean} readOnly - Optional. Whether the editor is in read-only mode (default: false)
 * @param {boolean} shouldShowExport - Optional. Whether to show export functionality (default: false)
 *
 * Ref Methods:
 * @method getSqlCode() - Returns the current SQL code generated from the diagram
 */

const DrawDbEditor = forwardRef(function DrawDbEditor(
  { data, onSave, readOnly = false, shouldShowExport = false },
  ref
) {
  return (
    <div className="w-full h-full min-h-unset">
      <Editor
        ref={ref}
        data={data}
        onSave={onSave}
        readOnly={readOnly}
        shouldShowExport={shouldShowExport}
      />
    </div>
  );
});

export default DrawDbEditor;
