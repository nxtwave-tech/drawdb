import { useDiagram } from "../../../hooks";
import { useMemo } from "react";
import EditIcon from "../../../icons/EditIcon";
import ArrowDownIcon from "../../../icons/ArrowDownIcon";
import { DeleteIcon, DataBaseIcon } from "../../../icons";
import { getCardinalityText } from "../../../utils/relationship";

export default function RelationshipCard({ data, onEdit, readOnly = false }) {
  const { tables, deleteRelationship } = useDiagram();

  const relValues = useMemo(() => {
    const startTable = tables.find((t) => t.id === data.startTableId);
    const endTable = tables.find((t) => t.id === data.endTableId);

    if (!startTable || !endTable) return null;

    const startField = startTable.fields.find(
      (f) => f.id === data.startFieldId
    );
    const endField = endTable.fields.find((f) => f.id === data.endFieldId);

    if (!startField || !endField) return null;

    return {
      startTableName: startTable.name,
      startFieldName: startField.name,
      startFieldType: startField.type,
      endTableName: endTable.name,
      endFieldName: endField.name,
      endFieldType: endField.type,
    };
  }, [tables, data]);

  if (!relValues) return null;

  const renderField = (field, type) => {
    return (
      <div className="flex items-center justify-between w-full gap-2">
        <div className="text-sm font-medium text-slate-900 opacity-80 leading-6 truncate flex-1 min-w-0">
          {field}
        </div>
        <div className="text-sm text-slate-600 opacity-80 leading-6 flex-shrink-0">
          {type}
        </div>
      </div>
    );
  };

  const renderTableName = (tableName) => {
    return (
      <div className="flex items-center gap-1 w-full">
        <DataBaseIcon width={16} height={16} stroke="#000000" />
        <div className="text-xs font-normal text-slate-600 leading-5 truncate flex-1 min-w-0">
          {tableName}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-slate-200 overflow-hidden -mt-px first:mt-0">
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-sm font-medium">
            {getCardinalityText(data.cardinality)}
          </div>

          {!readOnly && (
            <div className="flex items-center gap-2 ml-3">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => onEdit(data)}
              >
                <EditIcon stroke="#334155" />
              </div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => deleteRelationship(data.id)}
              >
                <DeleteIcon />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-full flex flex-col">
            {renderTableName(relValues.startTableName)}
            {renderField(relValues.startFieldName, relValues.startFieldType)}
          </div>
          <ArrowDownIcon />
          <div className="w-full flex flex-col">
            {renderTableName(relValues.endTableName)}
            {renderField(relValues.endFieldName, relValues.endFieldType)}
          </div>
        </div>
      </div>
    </div>
  );
}
