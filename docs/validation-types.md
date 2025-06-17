# Validation Type Implementations (`/src/validation/types/*`)

This document details the implementation logic for each built-in validation type function found within the `/src/validation/types/` directory.

**Note:** These functions typically receive the `data` (value to validate) and optional `options` as arguments.

--- 

### `array` (`./array/index.js`)

-   **Logic:** Uses `Array.isArray(data)`.
-   **Returns:** `true` if `data` is an array, `false` otherwise.

--- 

### `email` (`./email/index.js`)

-   **Logic:** Uses a regular expression `/^[^\[email protected]\]+@[^\[email protected]\]+\.[^\[email protected]\]+$/` to match common email patterns.
-   **Returns:** `true` if `data` matches the pattern, `false` otherwise.

--- 

### `faxNumber` (`./faxNumber/index.js`)

-   **Logic:** Uses a regular expression `/^\+?[0-9]+$/` to match an optional leading `+` followed by one or more digits.
-   **Returns:** `true` if `data` matches the pattern, `false` otherwise.

--- 

### `isObject` (`./isObject/index.js`)

-   **Logic:** Checks if `value` is not `null`, its `typeof` is `'object'`, and it's not an array (`!Array.isArray(value)`).
-   **Returns:** `true` if `value` is a plain object, `false` otherwise.

--- 

### `length` (`./length/index.js`)

-   **Logic:**
    -   Checks if `options.min` is defined and if `data.length` is less than `options.min`.
    -   Checks if `options.max` is defined and if `data.length` is greater than `options.max`.
-   **Returns:** `false` if any length constraint is violated, `true` otherwise. Assumes `data` has a `length` property (like strings or arrays).

--- 

### `nestedSlug` (`./nestedSlug/index.js`)

-   **Logic:** Uses a regular expression `/^\/([a-z0-9\-_]+(\/[a-z0-9\-_]+)*)?\/?$/`.
    -   Matches a leading `/`.
    -   Optionally matches one or more segments consisting of lowercase letters, numbers, hyphens, or underscores, separated by `/`.
    -   Allows an optional trailing `/`.
-   **Returns:** `true` if `data` matches the pattern, `false` otherwise.

--- 

### `number` (`./number/index.js`)

-   **Logic:** Uses a regular expression `/^[-+]?\d*\.?\d+$/`.
    -   Matches an optional sign (`+` or `-`).
    -   Matches zero or more digits.
    -   Matches an optional decimal point (`.`).
    -   Matches one or more digits.
    -   *Note:* This allows formats like `.5`, `1.`, `+10`.
-   **Returns:** `true` if `data` matches the pattern, `false` otherwise.

--- 

### `oneOf` (`./oneOf/index.js`)

-   **Logic:** Uses `options.includes(value)`.
-   **Parameters:** Requires `options` to be an array.
-   **Returns:** `true` if the `value` exists within the `options` array, `false` otherwise.

--- 

### `password` (`./password/index.js`)

-   **Logic:** Reuses the `length` validator with a hardcoded minimum length option: `length(data, { min: 4 })`.
-   **Returns:** `true` if `data.length` is 4 or more, `false` otherwise.
-   *Note:* The main `validation` function allows overriding this default via `typeOptions: { minLength: X }`, but the base `password` type function itself uses `min: 4`.

--- 

### `phoneNumber` (`./phoneNumber/index.js`)

-   **Logic:** Uses a regular expression `/^\+?(\d{1,3})?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/`.
    -   Matches an optional leading `+` followed by 1-3 digits (country code).
    -   Allows various separators (`-`, `.`, ` `) and optional parentheses around the area code.
    -   Matches a typical North American-like phone number structure.
-   **Returns:** `true` if `data` matches the pattern, `false` otherwise.

--- 

### `required` (`./required/index.js`)

-   **Logic:** Checks `typeof data !== "undefined"`.
-   **Returns:** `true` if `data` is not `undefined`, `false` otherwise.

--- 

### `schema` (`./schema/index.js`)

-   **Logic:**
    -   Iterates through the keys of the input `datas` (expected to be an array or object containing objects).
    -   For each object within `datas`, it gets the object's keys using `Object.keys(data)`.
    -   It compares these keys with the `options` array (expected to be an array of required key names) using a helper `isEqualArray`.
    -   `isEqualArray` checks if both arrays have the same length and if every item in the first array exists in the second array (order doesn't matter, but duplicates might cause issues depending on interpretation).
-   **Returns:** `false` if any object within `datas` does not have exactly the keys specified in `options`, `true` otherwise.

--- 

### `slug` (`./slug/index.js`)

-   **Logic:** Uses a regular expression `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`.
    -   Matches one or more lowercase letters or numbers.
    -   Optionally followed by groups of a hyphen and one or more lowercase letters or numbers.
    -   Does *not* allow leading/trailing hyphens or consecutive hyphens.
-   **Returns:** `true` if `data` matches the pattern, `false` otherwise.

--- 

### `string` (`./string/index.js`)

-   **Logic:** Checks `typeof data === "string"`.
-   **Returns:** `true` if `data` is a string, `false` otherwise.