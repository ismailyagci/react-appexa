# Utility Functions (`/src/utils/index.js`)

This module provides simple, general-purpose utility functions used throughout the `react-appexa` package.

## Functions

### `toCamelCase(str)`

Converts a string from snake_case or other formats to camelCase.

-   **Parameters:**
    -   `str` (string): The input string to convert.
-   **Returns:** (string) The camelCased version of the string.
-   **Example:**
    ```javascript
    import { toCamelCase } from "react-appexa/utils"; // Assuming utils are exported

    const snakeCase = "SOME_CONSTANT_NAME";
    const camelCase = toCamelCase(snakeCase); // Result: "someConstantName"
    ```

### `isObject(value)`

Checks if the provided value is a plain JavaScript object (and not `null` or an array).

-   **Parameters:**
    -   `value` (any): The value to check.
-   **Returns:** (boolean) `true` if the value is an object, `false` otherwise.
-   **Example:**
    ```javascript
    import { isObject } from "react-appexa/utils";

    console.log(isObject({ a: 1 })); // true
    console.log(isObject([1, 2]));   // false
    console.log(isObject(null));      // false
    console.log(isObject("hello"));  // false
    ```

### `cloneObject(data)`

Creates a deep clone of an object using `JSON.stringify` and `JSON.parse`. This method is simple but has limitations (e.g., loses functions, `Date` objects become strings, `undefined` values are removed).

-   **Parameters:**
    -   `data` (object): The object to clone.
-   **Returns:** (object) A deep clone of the input object.
-   **Example:**
    ```javascript
    import { cloneObject } from "react-appexa/utils";

    const original = { a: 1, b: { c: 2 } };
    const cloned = cloneObject(original);

    console.log(cloned); // { a: 1, b: { c: 2 } }
    console.log(original === cloned); // false
    console.log(original.b === cloned.b); // false
    ```