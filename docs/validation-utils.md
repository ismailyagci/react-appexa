# Validation Utility (`/src/validation/utils/index.js`)

This file contains helper functions used internally by the main validation module.

## `returnMessage(message, propName)`

-   **Purpose:** A simple utility to consistently format the return object when a validation rule fails.
-   **Parameters:**
    -   `message` (string): The generated error message string (typically from `/src/validation/messages/index.js`).
    -   `propName` (string): The name (key) of the field that failed validation.
-   **Returns:** (Object)
    ```javascript
    {
      status: false, // Indicates validation failure
      key: propName, // The field name
      message: message // The error message
    }
    ```
-   **Usage:** Called internally by the main `validation` function (`/src/validation/index.js`) whenever a `required` check or a specific `type` check fails.