import {  getInlineFK } from "./shared";


export function toSqlite(diagram) {
  return diagram.tables
    .map((table) => {
      const inlineFK = getInlineFK(table, diagram);
      return `CREATE TABLE ${table.name} (\n${table.fields
        .map(
          (field) =>
            `\t${
              field.name
            } ${field.type}${field.notNull ? " NOT NULL" : ""}${
              field.primary ? " PRIMARY KEY" : ""
            }`,
        )
        .join(",\n")}${inlineFK && inlineFK.length > 0 ? `,\n${inlineFK}` : ""}\n);\n${table.indices
        .map(
          (i) =>
            `\nCREATE ${i.unique ? "UNIQUE " : ""}INDEX "${
              i.name
            }"\nON "${table.name}" (${i.fields
              .map((f) => `"${f}"`)
              .join(", ")});`,
        )
        .join("\n")}`;
    })
    .join("\n");
}