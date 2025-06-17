# Internal Container (`/src/container/index.js`)

The `Container` is a simple, internal singleton instance used within `react-appexa` for managing shared state and facilitating communication between different modules of the package (like `Provider`, `request`, and `store`). It acts as a basic dependency injection container and event emitter.

## Purpose

-   **Shared Configuration:** Holds configuration data (like `appexa.json` content) accessible by different parts of the library.
-   **State Management:** Stores internal state flags (e.g., `isDevelopment`, `requestMethodsCreated`).
-   **Event Notification:** Allows modules to listen for changes or specific events occurring within the library.

## Usage (Internal)

The container is used internally and is not typically interacted with directly by the application developer using `react-appexa`.

-   **Initialization:** The `Provider` component initializes the container with configuration and development status.
-   **Request Module:** The `request` module reads configuration from the container and notifies the container once request methods are generated based on the config.
-   **Store Module:** The `store` module reads the development status for enabling/disabling the logger middleware.

## Methods

-   **`constructor()`**: Initializes the internal `state` (as a `Map`, though used like an object) and `listeners` array.
-   **`set(key, value)`**: Stores a key-value pair in the container's state and notifies all registered listeners about the change.
-   **`get(key)`**: Retrieves the value associated with a key from the container's state.
-   **`onChange(callback)`**: Registers a listener function. The callback will be invoked whenever `set` is called, receiving the `key` and `value` that were set.
-   **`notifyListeners(key, value)`**: Iterates through the registered listeners and calls each one with the provided key and value.

## Example (Conceptual Internal Flow)

```javascript
// 1. In Provider component
import container from './container';
import appexaConfig from '../appexa.json';

container.set("isDevelopment", process.env.NODE_ENV === 'development');
container.set("config", appexaConfig);

// 2. In Request module
import container from './container';

class RequestManager {
  constructor() {
    this.config = {};
    container.onChange((key, value) => {
      if (key === "config") {
        this.config = value.request;
        this.generateRequestMethods();
      }
    });
  }

  generateRequestMethods() {
    // ... logic to create methods based on this.config ...
    console.log("Request methods generated!");
    container.set("requestMethodsCreated", true); // Notify listeners
  }
}

// 3. Back in Provider component
import container from './container';

useEffect(() => {
  container.onChange((key) => {
    if (key === "requestMethodsCreated") {
      setAppReady(true); // Render children only after requests are ready
    }
  });
}, []);
```

This demonstrates how the container facilitates communication: the `Provider` sets the config, the `RequestManager` listens for it, generates methods, and then sets a flag (`requestMethodsCreated`), which the `Provider` listens for to finalize app readiness.