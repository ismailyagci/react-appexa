# Provider Component (`/src/provider/index.js`)

The `Provider` component is the main entry point for integrating `react-appexa` into a React application. It wraps the application's root component (or router) and sets up the necessary context for the Store and internal Container.

## Purpose

-   **Initialize Store:** Sets up the Redux store using the provided `storeModules` and optional `storeMiddlewares`.
-   **Initialize Container:** Populates the internal `container` with the `appexa.json` configuration (`config`) and development status (`isDevelopment`).
-   **Manage App Readiness:** Ensures that the main application content (`children`) is rendered only after the `request` module has finished generating methods based on the configuration (signaled via the `container`).
-   **Provide Context:** Makes the Redux store available to the component tree via `react-redux`'s `Provider`.

## Props

-   **`children`**: (ReactNode, required) The child components to render, typically the application's main router or root component.
-   **`storeModules`**: (Object, required) An object where keys are module names and values are instances of store module classes (like `Auth` or `Products` from the examples). This is used to configure the Redux store reducers and initial state.
-   **`storeMiddlewares`**: (Array<Middleware>, optional) An array of additional Redux middlewares to apply to the store (e.g., custom logging, analytics).
-   **`config`**: (Object, required) The parsed content of the `appexa.json` file, containing request configurations.
-   **`isDevelopment`**: (boolean, optional) A flag indicating whether the application is running in development mode. This typically controls whether the `redux-logger` middleware is added automatically.

## Usage

Wrap your application's root component (often a Router) with the `Appexa` Provider in your main entry file (e.g., `src/main.jsx` or `src/index.js`).

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router'; // Your application's router
import Appexa from 'react-appexa';
import storeModules from './storeModules'; // Your combined store modules
import appexaConfig from '../appexa.json'; // Your configuration file

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Pass required props to the Appexa Provider */}
    <Appexa 
      storeModules={storeModules} 
      config={appexaConfig}
      isDevelopment={import.meta.env.DEV} // Example: Set based on Vite env
      // storeMiddlewares={[/* custom middlewares */]}
    >
      <Router /> {/* Your application starts here */}
    </Appexa>
  </React.StrictMode>
);
```

## Internal Flow

1.  **Mount:** When the `Provider` component mounts, an `useEffect` hook runs.
2.  **Container Setup:** Inside the effect, it sets the `isDevelopment` flag and the `config` object in the internal `container`.
3.  **Listener Registration:** It registers a listener using `container.onChange`. This listener waits for the `container` to signal that `requestMethodsCreated` has been set to `true`.
4.  **Store Initialization:** The `StoreProvider` (imported from `/src/store/index.js`) is rendered. It takes the `storeModules` and `storeMiddlewares` to create and configure the Redux store.
5.  **App Readiness State:** An internal state variable `appReady` is initialized to `false`.
6.  **Request Method Generation:** The `request` module (listening to the `container` for the `config`) generates the API request methods based on `appexa.json`.
7.  **Notification:** Once request methods are ready, the `request` module calls `container.set("requestMethodsCreated", true)`.
8.  **State Update:** The listener registered in the `Provider`'s `useEffect` hook receives this notification and calls `setAppReady(true)`.
9.  **Render Children:** The component re-renders, and since `appReady` is now `true`, the `{appReady ? children : null}` condition passes, rendering the application's main content (`children`).

This ensures that components attempting to use `request` methods (often dispatched via store actions) will not do so until the `request` module is fully initialized based on the `appexa.json` configuration.