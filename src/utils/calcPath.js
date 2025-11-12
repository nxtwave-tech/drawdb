import { tableWidth } from "../data/constants";

/**
 * Generates an SVG path string to visually represent a relationship between two fields.
 *
 * @param {{
 *   startTable: { x: number, y: number },
 *   endTable: { x: number, y: number },
 *   startFieldIndex: number,
 *   endFieldIndex: number
 * }} r - Relationship data.
 * @param {number} tableWidth - Width of each table (used to calculate horizontal offsets).
 * @param {number} zoom - Zoom level (used to scale vertical spacing).
 * @returns {string} SVG path "d" attribute string.
 */
export function calcPath(r, tableWidth = 200, zoom = 1) {
  if (!r) {
    return "";
  }

  const width = tableWidth * zoom;
  let x1 = r.startTable.x - 5;
  let y1 = r.startTable.y + r.startFieldIndex * 32 + 38 + 18;
  let x2 = r.endTable.x + 5;
  let y2 = r.endTable.y + r.endFieldIndex * 32 + 38 + 18;

  let radius = 10 * zoom;
  const midX = (x2 + x1 + width) / 2;
  const endX = x2 + width < x1 ? x2 + width : x2;

  if (Math.abs(y1 - y2) <= 36 * zoom) {
    radius = Math.abs(y2 - y1) / 3;
    if (radius <= 2) {
      if (x1 + width <= x2) return `M ${x1 + width} ${y1} L ${x2} ${y2 + 0.1}`;
      else if (x2 + width < x1)
        return `M ${x1} ${y1} L ${x2 + width} ${y2 + 0.1}`;
    }
  }

  if (y1 <= y2) {
    if (x1 + width <= x2) {
      return `M ${x1 + width} ${y1} L ${
        midX - radius
      } ${y1} A ${radius} ${radius} 0 0 1 ${midX} ${y1 + radius} L ${midX} ${
        y2 - radius
      } A ${radius} ${radius} 0 0 0 ${midX + radius} ${y2} L ${endX} ${y2}`;
    } else if (x2 <= x1 + width && x1 <= x2) {
      return `M ${x1 + width} ${y1} L ${
        x2 + width
      } ${y1} A ${radius} ${radius} 0 0 1 ${x2 + width + radius} ${
        y1 + radius
      } L ${x2 + width + radius} ${y2 - radius} A ${radius} ${radius} 0 0 1 ${
        x2 + width
      } ${y2} L ${x2 + width} ${y2}`;
    } else if (x2 + width >= x1 && x2 + width <= x1 + width) {
      return `M ${x1} ${y1} L ${
        x2 - radius
      } ${y1} A ${radius} ${radius} 0 0 0 ${x2 - radius - radius} ${
        y1 + radius
      } L ${x2 - radius - radius} ${y2 - radius} A ${radius} ${radius} 0 0 0 ${
        x2 - radius
      } ${y2} L ${x2} ${y2}`;
    } else {
      return `M ${x1} ${y1} L ${
        midX + radius
      } ${y1} A ${radius} ${radius} 0 0 0 ${midX} ${y1 + radius} L ${midX} ${
        y2 - radius
      } A ${radius} ${radius} 0 0 1 ${midX - radius} ${y2} L ${endX} ${y2}`;
    }
  } else {
    if (x1 + width <= x2) {
      return `M ${x1 + width} ${y1} L ${
        midX - radius
      } ${y1} A ${radius} ${radius} 0 0 0 ${midX} ${y1 - radius} L ${midX} ${
        y2 + radius
      } A ${radius} ${radius} 0 0 1 ${midX + radius} ${y2} L ${endX} ${y2}`;
    } else if (x1 + width >= x2 && x1 + width <= x2 + width) {
      return `M ${x1} ${y1} L ${
        x1 - radius - radius
      } ${y1} A ${radius} ${radius} 0 0 1 ${x1 - radius - radius - radius} ${
        y1 - radius
      } L ${x1 - radius - radius - radius} ${
        y2 + radius
      } A ${radius} ${radius} 0 0 1 ${
        x1 - radius - radius
      } ${y2} L ${endX} ${y2}`;
    } else if (x1 >= x2 && x1 <= x2 + width) {
      return `M ${x1 + width} ${y1} L ${
        x1 + width + radius
      } ${y1} A ${radius} ${radius} 0 0 0 ${x1 + width + radius + radius} ${
        y1 - radius
      } L ${x1 + width + radius + radius} ${
        y2 + radius
      } A ${radius} ${radius} 0 0 0 ${x1 + width + radius} ${y2} L ${
        x2 + width
      } ${y2}`;
    } else {
      return `M ${x1} ${y1} L ${
        midX + radius
      } ${y1} A ${radius} ${radius} 0 0 1 ${midX} ${y1 - radius} L ${midX} ${
        y2 + radius
      } A ${radius} ${radius} 0 0 0 ${midX - radius} ${y2} L ${endX} ${y2}`;
    }
  }
}

export function getBadgePosition(pathValues) {
  if (!pathValues) return null;

  const pathString = calcPath(pathValues, tableWidth);
  if (!pathString) return null;

  const parsePathCoordinates = (path) => {
    const coordinates = [];

    const moveMatch = path.match(/M\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/);
    if (moveMatch) {
      coordinates.push({
        x: parseFloat(moveMatch[1]),
        y: parseFloat(moveMatch[2]),
        type: "M",
      });
    }

    const lineMatches = [
      ...path.matchAll(/L\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/g),
    ];
    lineMatches.forEach((match) => {
      coordinates.push({
        x: parseFloat(match[1]),
        y: parseFloat(match[2]),
        type: "L",
      });
    });

    return coordinates;
  };

  const hasArcs = pathString.includes(" A ");

  if (!hasArcs) {
    const moveMatch = pathString.match(/M\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/);
    const lineMatch = pathString.match(/L\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/);
    if (moveMatch && lineMatch) {
      const x1 = parseFloat(moveMatch[1]);
      const y1 = parseFloat(moveMatch[2]);
      const x2 = parseFloat(lineMatch[1]);
      const y2 = parseFloat(lineMatch[2]);
      return {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2,
      };
    }
  } else {
    const coordinates = parsePathCoordinates(pathString);

    const startTableX = pathValues.startTable.x;
    const endTableX = pathValues.endTable.x;
    const tableMidpoint = (startTableX + endTableX + tableWidth) / 2;

    const middleIndex = Math.floor(coordinates.length / 2);
    const prevIndex = middleIndex > 0 ? middleIndex - 1 : 0;

    const prevPoint = coordinates[prevIndex];
    const middlePoint = coordinates[middleIndex];

    const segmentX = (prevPoint.x + middlePoint.x) / 2;

    const isOnLeftSide = segmentX < tableMidpoint;

    const firstCoordX = coordinates[0].x;
    const lastCoordX = coordinates[coordinates.length - 1].x;
    const startTableLeftEdge = startTableX - 5;
    const startTableRightEdge = startTableX + tableWidth - 5;

    const startsFromRightEdge =
      Math.abs(firstCoordX - startTableRightEdge) <
      Math.abs(firstCoordX - startTableLeftEdge);

    const goesRight = lastCoordX > firstCoordX;
    const goesLeft = lastCoordX < firstCoordX;

    let xPos = segmentX;

    if (startsFromRightEdge && goesRight) {
      if (isOnLeftSide) {
        xPos = xPos + 5;
      } else {
        xPos = xPos - 5;
      }
    } else if (startsFromRightEdge && goesLeft) {
      if (isOnLeftSide) {
        xPos = xPos + 5;
      } else {
        xPos = xPos + 5;
      }
    } else if (!startsFromRightEdge && goesRight) {
      if (isOnLeftSide) {
        xPos = xPos - 5;
      } else {
        xPos = xPos + 5;
      }
    } else {
      if (isOnLeftSide) {
        xPos = xPos - 10;
      } else {
        xPos = xPos - 5;
      }
    }

    return {
      x: xPos,
      y: (prevPoint.y + middlePoint.y) / 2,
    };
  }

  return null;
}
