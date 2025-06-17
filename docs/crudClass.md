# `store.CRUD` Base Class (`/src/store/crud/index.js`)

The `store.CRUD` class is a core utility in `react-appexa` designed to abstract away the boilerplate code typically associated with setting up Redux state, actions, and reducers for standard Create, Read, Update, Delete (CRUD) operations.

## Purpose

To provide a reusable base class that automatically generates:

1.  **Constants:** Action type constants for pending, success, error, and reset states for each defined CRUD operation.
2.  **Initial State:** A structured initial state slice for each CRUD operation, typically including `pending`, `data`, `error`, and `initialSuccess` flags.
3.  **Action Creators:** Basic action creator functions corresponding to the generated constants (e.g., `createItemPending()`, `createItemSuccess(data)`).
4.  **Reducer Logic (`handleAction`)**: Default reducer functions (handlers) for each generated action type to update the state accordingly.

## Constructor

When extending `store.CRUD`, you call `super(props)` in your derived class's constructor.

-   **`props`** (Object): Configuration object.
    -   **`items`** (Array<string>, required): An array of strings representing the base names for your CRUD operations (e.g., `["FETCH_USERS", "CREATE_USER"]`). These names are used to generate constants and state keys.
    -   **`state`** (Object, optional): An object containing additional custom state properties to be merged with the auto-generated state.
    -   **`constants`** (Object, optional): An object containing additional custom action type constants to be merged with the auto-generated constants.

## Auto-Generated Elements

Based on the `items` array provided to the constructor (e.g., `items: ["FETCH_DATA"]`), the `CRUD` class automatically generates the following:

**1. Constants (`this.constants`)**

For each `item` (e.g., `"FETCH_DATA"`), it generates four constants:

-   `FETCH_DATA_PENDING`: "FETCH_DATA_PENDING"
-   `FETCH_DATA_SUCCESS`: "FETCH_DATA_SUCCESS"
-   `FETCH_DATA_ERROR`: "FETCH_DATA_ERROR"
-   `FETCH_DATA_RESET`: "FETCH_DATA_RESET"

These are accessible via `this.constants` in the derived class.

**2. Initial State (`this.state`)**

For each `item`, it generates a corresponding key in the initial state object (converted to camelCase, e.g., `fetchData`). Each key holds a default state structure:

```javascript
{
  fetchData: {
    pending: false,       // Is the operation currently in progress?
    data: null,           // Holds the success response data
    error: null,          // Holds the error response data
    initialSuccess: false // Has the operation succeeded at least once?
  },
  // ... other items
  // ... custom state properties from constructor
}
```

This structure is accessible via `this.state`.

**3. Action Creators (Methods)**

For each `item` (e.g., `"FETCH_DATA"`), it generates corresponding action creator methods (named in camelCase):

-   `fetchDataPending()`: Returns `{ type: this.constants.FETCH_DATA_PENDING }`
-   `fetchDataSuccess(data)`: Returns `{ type: this.constants.FETCH_DATA_SUCCESS, data }`
-   `fetchDataError(error)`: Returns `{ type: this.constants.FETCH_DATA_ERROR, data: error }` (Note: payload is assigned to `data` key)
-   `fetchDataReset()`: Returns `{ type: this.constants.FETCH_DATA_RESET }`

These methods are attached directly to the class instance (`this`) and can be called within your thunk actions (e.g., `dispatch(this.fetchDataPending())`).

**4. Reducer Logic (`this.handleAction()`)**

The `handleAction()` method returns an object mapping camelCased action types to reducer functions. For each `item` (e.g., `"FETCH_DATA"`), it generates handlers:

-   `fetchDataPending`: Updates state slice: `{ pending: true }`
-   `fetchDataSuccess`: Updates state slice: `{ data: action.data, pending: false, error: null, initialSuccess: true }`
-   `fetchDataError`: Updates state slice: `{ pending: false, error: action.data }` (Uses `action.data` as error)
-   `fetchDataReset`: Resets the state slice back to the initial CRUD template (`{ pending: false, data: null, error: null, initialSuccess: false }`).

This returned object is used by the main store setup (`/src/store/index.js`) to handle dispatched actions for this module's state slice.

## Overriding and Extending

-   **Custom State/Constants:** Pass `state` and `constants` objects to the `super()` call.
-   **Custom Reducer Logic:** Override the `handleAction()` method in your derived class. You can call `super.handleAction()` to get the base handlers and merge them with your custom handlers.

## Internal Utilities (`/src/store/crud/utils.js`)

These helper functions are used internally by the `CRUD` class:

-   `createObject(items, callback)`: Generic utility to create an object by iterating over items and applying a callback.
-   `generateCrudState(args, template)`: Creates the initial state structure for CRUD items.
-   `generateCrudConstants(name)`: Generates the PENDING, SUCCESS, ERROR, RESET constant names for a given base name.
-   `generateCrudActions(name, crudTemplate)`: Generates the default reducer handler functions for a given base name.