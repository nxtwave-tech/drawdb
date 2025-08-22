# DrawDB Module Federation Setup

This repository has been configured to expose the DrawDB Editor as a federated module that can be consumed by other applications.

## What's Exposed

The `Editor` component is exposed as a federated module at `./Editor` and can be imported from `drawdb/Editor`.

## Configuration

### Host Application (This App)

- **Module Name**: `drawdb`
- **Remote Entry**: `remoteEntry.js`
- **Exposed Component**: `./Editor` → `./src/remoteEntry.jsx`

### Consumer Application Setup

To consume this module in another application, you need to:

1. **Install Module Federation Plugin** (for Vite):

```bash
npm install @originjs/vite-plugin-federation@^1.3.6 --save-dev
```

2. **Configure Consumer App's vite.config.js**:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "consumer-app",
      remotes: {
        drawdb: "http://localhost:4173/assets/remoteEntry.js", // Update URL as needed
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^17.0.2",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^17.0.2",
        },
        "react-i18next": {
          singleton: true,
        },
        i18next: {
          singleton: true,
        },
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
```

3. **Use the Federated Component**:

```jsx
import React, { useRef, Suspense } from "react";

const DrawDBEditor = React.lazy(() => import("drawdb/Editor"));

const MyApp = () => {
  const editorRef = useRef(null);

  const diagramData = {
    tables: [
      {
        name: "users",
        comment: "",
        color: "#175e7a",
        fields: [
          {
            id: "1",
            name: "id",
            type: "INT",
            comment: "",
            unique: true,
            increment: false,
            notNull: true,
            primary: true,
            default: "",
            check: "",
          },
          {
            id: "2",
            name: "email",
            type: "VARCHAR",
            comment: "",
            unique: true,
            increment: false,
            notNull: true,
            primary: false,
            default: "",
            check: "",
          },
        ],
        indices: [],
        id: "table_1",
        x: 100,
        y: 100,
      },
    ],
    relationships: [],
    title: "My Database Schema",
  };

  const handleSave = (savedData) => {
    console.log("Diagram saved:", savedData);
    // Parse the JSON string if needed
    const parsedData = JSON.parse(savedData);
    // Save to your backend, localStorage, etc.
  };

  const handleGetSQL = () => {
    if (editorRef.current) {
      const sqlCode = editorRef.current.getSqlCode();
      console.log("Generated SQL:", sqlCode);
      // Use the SQL code as needed
    }
  };

  return (
    <div className="app">
      <h1>My Application</h1>
      <button onClick={handleGetSQL}>Export SQL</button>

      <Suspense fallback={<div>Loading editor...</div>}>
        <DrawDBEditor
          ref={editorRef}
          data={diagramData}
          onSave={handleSave}
          shouldShowExport={true}
        />
      </Suspense>
    </div>
  );
};

export default MyApp;
```

## Component Props

### `data` (Object)

The diagram data containing:

- `tables` (Array): Array of table objects
- `relationships` (Array): Array of relationship objects between tables
- `title` (String): The diagram title (optional, defaults to "Untitled Diagram")

### `onSave` (Function)

Callback function called when the diagram is saved. Receives the complete diagram state as a JSON string.

### `readOnly` (Boolean, Optional)

Whether the editor is in read-only mode. Default: `false`

### `shouldShowExport` (Boolean, Optional)

Whether to show export functionality in the editor. Default: `false`

### Component Ref Methods

When using a ref with the component, you have access to:

#### `getSqlCode()`

Returns the current SQL code generated from the diagram.

```jsx
const editorRef = useRef(null);

const handleExportSQL = () => {
  if (editorRef.current) {
    const sqlCode = editorRef.current.getSqlCode();
    console.log("Generated SQL:", sqlCode);
  }
};
```

#### Table Object Structure:

```javascript
{
  id: "unique_table_id",
  name: "table_name",
  comment: "",
  color: "#175e7a", // Table color
  x: 100, // X position on canvas
  y: 100, // Y position on canvas
  fields: [
    {
      id: "unique_field_id",
      name: "field_name",
      type: "INT|VARCHAR|TEXT|etc",
      comment: "",
      unique: boolean,
      increment: boolean,
      notNull: boolean,
      primary: boolean,
      default: "",
      check: ""
    }
  ],
  indices: []
}
```

#### Relationship Object Structure:

```javascript
{
  id: number,
  name: "relationship_name",
  startTableId: "table_id",
  startFieldId: "field_id",
  endTableId: "table_id",
  endFieldId: "field_id",
  cardinality: "one_to_one|one_to_many|many_to_one|many_to_many",
  updateConstraint: "No action|Cascade|Set null|Set default|Restrict",
  deleteConstraint: "No action|Cascade|Set null|Set default|Restrict"
}
```

## Development

### Host Application Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build (where federated module is served)
npm run preview
```

### URLs

- **Development**: `http://localhost:5173`
- **Production Preview**: `http://localhost:4173`
- **Remote Entry**: `http://localhost:4173/assets/remoteEntry.js` (in production preview)

## Important Notes

1. **Shared Dependencies**: React, React-DOM, react-i18next, i18next, and i18next-browser-languagedetector are configured as singletons to prevent version conflicts.

2. **CSS Inclusion**: The federated component automatically includes all necessary styles.

3. **i18n**: Internationalization is included and initialized automatically.

4. **Error Handling**: The component provides default fallbacks if props are not provided.

5. **Build Configuration**: The build is configured with `target: 'esnext'` and disabled minification for better federation compatibility.

6. **Lazy Loading**: Use `React.lazy()` for code splitting and include the component in a `Suspense` boundary.

7. **Ref Methods**: Use `useRef()` to access component methods like `getSqlCode()` for programmatic access to generated SQL.

## Troubleshooting

1. **Module Not Found**: Ensure the host application is running and accessible at the configured URL.

2. **React Version Conflicts**: Make sure both host and consumer apps use compatible React versions (^17.0.2).

3. **CSS Issues**: If styles don't load properly, ensure the CSS imports are working in the federated component.

4. **Build Issues**: Try disabling minification and CSS code splitting in both applications' Vite configs.

5. **Ref Not Working**: Ensure the editor has fully loaded before calling ref methods. Check that `editorRef.current` is not null.

6. **Vite Version**: This setup is tested with Vite ^6.3.4. Ensure both host and consumer use compatible versions.
