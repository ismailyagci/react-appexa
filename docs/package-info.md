# Package Information (`/package.json`)

This file contains metadata about the `react-appexa` npm package, including its dependencies, scripts, and configuration for publishing.

## Key Fields

-   **`name`**: `"react-appexa"`
    -   The official name of the package on npm.
-   **`version`**: `"1.0.19"` (as of the provided context)
    -   The current version of the package. Follows Semantic Versioning (SemVer).
-   **`description`**: `""` (Empty in the provided context)
    -   A brief description of the package's purpose.
-   **`files`**: `["dist"]`
    -   Specifies which files and directories should be included when the package is published to npm. Only the compiled output in the `dist` directory is included.
-   **`main`**: `"./dist/react-appexa.umd.js"`
    -   The entry point for CommonJS environments (e.g., Node.js `require`). Points to the UMD (Universal Module Definition) build.
-   **`module`**: `"./dist/react-appexa.es.js"`
    -   The entry point for ES Module environments (e.g., bundlers like Vite, Webpack `import`). Points to the ES Module build.
-   **`exports`**: (Object)
    -   Provides modern conditional exports for different environments, ensuring the correct module format is used.
    ```json
    "exports": {
      ".": {
        "import": "./dist/react-appexa.es.js", // For import statements
        "require": "./dist/react-appexa.umd.js" // For require statements
      }
    }
    ```
-   **`scripts`**: (Object)
    -   Defines command-line scripts for development and building.
        -   `dev`: `"vite"` - Starts the Vite development server (likely for testing or a demo app).
        -   `build`: `"vite build"` - Builds the library for production using Vite, creating the `dist` directory.
        -   `preview`: `"vite preview"` - Serves the production build locally for previewing.
-   **`keywords`**: `[]` (Empty in the provided context)
    -   Keywords to help users find the package on npm.
-   **`author`**: `""` (Empty in the provided context)
    -   The author of the package.
-   **`license`**: `"ISC"`
    -   The software license under which the package is distributed.

## Dependencies

-   **`dependencies`**: (Object) - Packages required for the library to function at runtime.
    -   `@vitejs/plugin-react`: Used by Vite for React integration (runtime dependency might be questionable here, potentially should be dev). Version `^4.2.1`.
    -   `axios`: `^1.4.0` - Used for making HTTP requests (core of the `request` module).
    -   `esbuild`: `^0.19.1` - Fast JavaScript bundler/minifier, likely used by Vite internally.
    -   `json5`: `^2.2.3` - Used to parse JSON5 (potentially for `appexa.json` if it allows comments/trailing commas, though not explicitly shown).
    -   `react`: `^18.2.0` - Required peer dependency for using React features.
    -   `react-dom`: `^18.2.0` - Required peer dependency for rendering.
    -   `react-redux`: `^8.1.2` - Used for integrating React with the Redux store.
    -   `redux`: `^4.2.1` - The core Redux library for state management.
    -   `redux-logger`: `^3.0.6` - Middleware for logging Redux actions and state changes (used in development).
    -   `redux-thunk`: `^2.4.2` - Middleware for handling asynchronous actions in Redux.
-   **`devDependencies`**: (Object) - Packages required only for development and building the library.
    -   `@testing-library/dom`, `@testing-library/react`, `react-test-renderer`: For testing React components.
    -   `@vitejs/plugin-react`: Vite plugin for React support (duplicate from dependencies, likely belongs here primarily). Version `^4.0.4`.
    -   `c8`: Code coverage tool.
    -   `eslint`, `eslint-plugin-react`: For code linting.
    -   `jsdom`: For simulating a DOM environment for tests.
    -   `vite`: `^5.1.6` - The build tool and development server.
    -   `vitest`: `^0.34.1` - Test runner integrated with Vite.

## Build Process

The library is built using Vite (`vite build`). The configuration in `/vite.config.js` specifies how the source code in `/src` is compiled into different module formats (`UMD`, `ES`) and placed in the `/dist` directory, which is then published to npm.