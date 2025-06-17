# Request Module (`/src/request/index.js`)

The `request` module in `react-appexa` provides a centralized and configurable way to handle API requests within the application. It leverages `axios` for making HTTP requests and integrates tightly with the `appexa.json` configuration file and the internal `container`.

## Core Features

-   **Configuration-Driven:** API endpoints and base URLs are defined declaratively in `appexa.json`.
-   **Dynamic Method Generation:** Creates JavaScript functions corresponding to each endpoint defined in `appexa.json`, allowing calls like `request.createItem(data)`.
-   **Axios Integration:** Uses an underlying `axios` instance for requests.
-   **Interceptors:** Automatically sets the `baseURL` based on development status (`isDevelopment` flag from the container) and injects headers managed by the module.
-   **Header Management:** Provides methods (`setHeader`, `getHeader`) to manage request headers (e.g., authentication tokens).
-   **URL Parameter Replacement:** Supports dynamic URL segments using `{{param}}` syntax.
-   **Centralized Success Check:** Implements a standard way (`isSuccessRequest`) to check if a response indicates success (based on `response.data.code === 200`).

## Configuration (`appexa.json`)

The behavior of the `request` module is primarily driven by the `request` section in the `appexa.json` file. This file is loaded via the `Provider` component and passed to the internal `container`.

```json
{
  "request": {
    "baseUrl": "https://api.production.com/",
    "devBaseUrl": "https://api.development.com/", // Optional: Used if isDevelopment=true
    "createCategory": {
      "type": "post", // HTTP method (get, post, patch, delete)
      "url": "category/createCategory", // Path relative to baseUrl/devBaseUrl
      "headers": { // Optional: Endpoint-specific headers
        "X-Custom-Header": "value"
      }
    },
    "getCategoryById": {
      "type": "get",
      "url": "category/get/{{categoryId}}" // URL with parameter placeholder
    },
    "updateItem": {
      "type": "patch",
      "url": "item/update"
    },
    "deleteItem": {
      "type": "delete",
      "url": "item/delete/{{itemId}}"
    }
    // ... other endpoints
  }
}
```

-   **`baseUrl`**: The base URL for production API requests.
-   **`devBaseUrl`**: (Optional) The base URL for development API requests. Used if `isDevelopment` is true when setting up the `Provider`.
-   **Endpoint Definitions (e.g., `createCategory`)**: Each key defines an API endpoint.
    -   `type`: The HTTP method (`get`, `post`, `patch`, `delete`).
    -   `url`: The URL path relative to the base URL. Can include placeholders like `{{paramName}}`.
    -   `headers`: (Optional) An object containing headers specific to this endpoint.

## Usage

Once `react-appexa` is initialized via the `Provider`, you can import and use the `request` object, typically within your store modules (actions/thunks).

```javascript
import { request } from 'react-appexa';

// Example within a store module action
class CategoryModule {
  // ... other methods

  createCategory = (categoryData) => async (dispatch) => {
    dispatch(this.createCategoryPending()); // Assuming CRUD pattern
    try {
      // Call the dynamically generated method
      const response = await request.createCategory(categoryData);
      // response already contains res.data if successful (code === 200)
      dispatch(this.createCategorySuccess(response)); 
      return response;
    } catch (error) {
      // error can be the axios error object or the response if code !== 200
      const errorMessage = error?.data?.message || error?.message || 'Failed to create category';
      dispatch(this.createCategoryError({ error: errorMessage }));
      return Promise.reject(error); // Propagate rejection
    }
  };

  fetchCategory = (categoryId) => async (dispatch) => {
    dispatch(this.fetchCategoryPending());
    try {
      // Pass URL parameters as the second argument
      const response = await request.getCategoryById(null, { categoryId: categoryId }); 
      // For GET requests, the first argument (params) is for query string parameters
      // const response = await request.getCategories({ page: 1, limit: 10 }); // Example with query params
      dispatch(this.fetchCategorySuccess(response));
      return response;
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to fetch category';
      dispatch(this.fetchCategoryError({ error: errorMessage }));
      return Promise.reject(error);
    }
  };

   deleteCategory = (categoryId) => async (dispatch) => {
    dispatch(this.deleteCategoryPending());
    try {
      // For DELETE, first arg is body (often null/empty), second is URL params
      const response = await request.deleteItem(null, { itemId: categoryId }); 
      dispatch(this.deleteCategorySuccess(response));
      return response;
    } catch (error) {
      // ... error handling
    }
  };
}
```

### Method Signatures

The dynamically generated methods generally follow this pattern:

-   `request.methodName(params, urlParams)`
    -   `params`: Data payload for the request.
        -   For `GET`, `DELETE`: Typically used for query string parameters (passed as `config.params` or `config.data` to axios respectively).
        -   For `POST`, `PATCH`: Used as the request body.
    -   `urlParams`: (Optional) An object containing key-value pairs to replace placeholders (`{{key}}`) in the endpoint's URL.

### Header Management

You can set global headers (like authentication tokens) that will be included in all subsequent requests.

```javascript
import { request } from 'react-appexa';

// After login
const token = 'your-auth-token';
request.setHeader('x-access-token', token);

// On logout
request.setHeader('x-access-token', ''); // Clear the token

// Get all current headers
const currentHeaders = request.getHeader(); 
```

## Internal Implementation Details

-   **`RequestManager` Class:** The core logic is encapsulated in this class, and a singleton instance is exported.
-   **`createListeners`:** Listens for changes in the `container`, specifically for the `config` key, to trigger `generateRequestMethods`.
-   **`generateRequestMethods`:** Iterates over the keys in `config.request` (excluding `baseUrl` and `devBaseUrl`) and dynamically attaches corresponding methods (`getMethod`, `postMethod`, etc.) to the exported `request` object.
-   **`templateReplacer`:** Handles the replacement of `{{param}}` placeholders in URLs.
-   **Axios Interceptor:** Ensures `baseURL` and managed `headers` are correctly set before each request is sent.
-   **Promise-Based:** All request methods return Promises, resolving with `response.data` on success (`code === 200`) and rejecting otherwise.