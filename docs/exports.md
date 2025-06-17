# Library Exports (`/src/index.js`)

This file serves as the main entry point for the `react-appexa` library, defining what components, functions, and objects are made available to consuming applications.

## Default Export

-   **`Provider`**: The main `Appexa` Provider component.
    -   Imported from: `./provider` (`/src/provider/index.js`)
    -   Usage: This is the primary component used to wrap the application and initialize `react-appexa`.
    ```jsx
    import Appexa from 'react-appexa'; // Default import
    // ... rest of setup
    <Appexa {...props}>
      <App />
    </Appexa>
    ```

## Named Exports

These are exported as properties of a single object, allowing for grouped imports.

-   **`store`**: An object containing utilities and components related to the Redux store setup.
    -   Imported from: `./store` (`/src/store/index.js`)
    -   Contains: `StoreProvider` (internal use within default Provider), `getStore`, `CRUD`, `useDispatch`, `useSelector`, `withForward`, `asyncDispatch`.
    -   Usage:
    ```javascript
    import { store } from 'react-appexa';
    
    class MyModule extends store.CRUD { /* ... */ }
    const dispatch = store.useDispatch();
    const data = store.useSelector(state => state.someSlice.data);
    await store.asyncDispatch(action1, store.withForward(res => action2(res)));
    ```

-   **`request`**: The singleton instance of the `RequestManager`'s exported methods, used for making API calls based on `appexa.json`.
    -   Imported from: `./request` (`/src/request/index.js`)
    -   Contains: Dynamically generated methods based on `appexa.json`, plus `setHeader`, `getHeader`, `getRequestConfig`.
    -   Usage:
    ```javascript
    import { request } from 'react-appexa';

    request.setHeader('Authorization', 'Bearer ...');
    const users = await request.getUsers();
    const newUser = await request.createUser({ name: 'John Doe' });
    ```

-   **`container`**: The internal singleton container instance for shared state and events within the library.
    -   Imported from: `./container` (`/src/container/index.js`)
    -   Usage: Primarily for internal library use. Direct use in application code is generally not recommended or needed.

-   **`validation`**: The validation function and associated tools.
    -   Imported from: `./validation` (`/src/validation/index.js`)
    -   Contains: The main `validation(schema, props)` function and `validation.tools` (access to individual type validators).
    -   Usage:
    ```javascript
    import { validation } from 'react-appexa';

    const result = validation(mySchema, formData);
    if (!result.status) { /* handle error */ }
    // Accessing a specific validator (less common)
    const isEmailValid = validation.tools.email('test@example.com'); 
    ```

-   **`utils`**: An object containing general utility functions.
    -   Imported from: `./utils` (`/src/utils/index.js`)
    -   Contains: `toCamelCase`, `isObject`, `cloneObject`.
    -   Usage:
    ```javascript
    import { utils } from 'react-appexa';

    const camelCaseKey = utils.toCamelCase('snake_case_key');
    const isObj = utils.isObject(someValue);
    ```

## Importing

You typically import the default `Provider` and specific named exports as needed:

```javascript
import Appexa, { request, store, validation, utils } from 'react-appexa';

// Use Appexa as the Provider component
// Use request for API calls
// Use store for Redux hooks and CRUD class
// Use validation for form validation
// Use utils for helper functions
```