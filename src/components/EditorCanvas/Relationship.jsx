import { useMemo, useRef } from "react";
import { tableWidth } from "../../data/constants";
import { calcPath, getBadgePosition } from "../../utils/calcPath";
import { useDiagram } from "../../hooks";
import { getCardinalityText } from "../../utils/relationship";

export default function Relationship({ data }) {
  const { tables } = useDiagram();

  const pathValues = useMemo(() => {
    const startTable = tables.find((t) => t.id === data.startTableId);
    const endTable = tables.find((t) => t.id === data.endTableId);

    if (!startTable || !endTable) return null;

    return {
      startFieldIndex: startTable.fields.findIndex(
        (f) => f.id === data.startFieldId
      ),
      endFieldIndex: endTable.fields.findIndex((f) => f.id === data.endFieldId),
      startTable: { x: startTable.x, y: startTable.y },
      endTable: { x: endTable.x, y: endTable.y },
    };
  }, [tables, data]);

  const pathRef = useRef();

  const badgePosition = useMemo(() => {
    return getBadgePosition(pathValues);
  }, [pathValues]);

  return (
    <>
      <defs>
        <marker
          id={`arrowhead-${data.id}`}
          markerWidth="10"
          markerHeight="8"
          refX="8"
          refY="4"
          orient="auto"
        >
          <path
            d="M 2 1 L 7 4 L 2 7"
            fill="none"
            stroke="#2563EB"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:stroke-blue-700"
          />
        </marker>
      </defs>
      <g className="select-none group">
        <path
          ref={pathRef}
          d={calcPath(pathValues, tableWidth)}
          stroke="#2563EB"
          className="group-hover:stroke-blue-700 drop-shadow-sm"
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          cursor="pointer"
          markerEnd={`url(#arrowhead-${data.id})`}
        />
        {badgePosition && (
          <foreignObject
            x={badgePosition.x - 16}
            y={badgePosition.y - 16}
            width="32"
            height="32"
            style={{ overflow: "visible" }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#DBEAFE",
                border: "1px solid #2563EB",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 500,
                color: "#1D4ED8",
                pointerEvents: "none",
              }}
            >
              {getCardinalityText(data.cardinality)}
            </div>
          </foreignObject>
        )}
      </g>
    </>
  );
}
