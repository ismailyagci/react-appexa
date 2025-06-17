# Using the CRUD Class for Store Modules

`react-appexa` provides a `store.CRUD` base class designed to significantly simplify the creation of Redux store modules for common Create, Read, Update, Delete (CRUD) operations. By extending this class, you get automatically generated action types, action creators, initial state structure, and reducer logic for your specified operations.

## Example: Products Module

Let's create a store module to manage products.

**1. Define the Module Class (`src/storeModules/products.js`)**

Create a class that extends `store.CRUD`. In the constructor, call `super()` with configuration options.

```jsx
import { request, store } from "react-appexa";

class Products extends store.CRUD {
  constructor() {
    // Define the base names for your CRUD operations
    super({
      items: [
        "CREATE_PRODUCT", // For creating a single product
        "FETCH_PRODUCTS", // For fetching a list of products
        "UPDATE_PRODUCT", // For updating a single product
        "DELETE_PRODUCT"  // For deleting a single product
      ],
      // Optional: Define additional custom state properties
      state: {
        searchTerm: '',
        filterCategory: null
      },
      // Optional: Define additional custom constants
      constants: {
        SET_SEARCH_TERM: "SET_SEARCH_TERM",
        SET_FILTER_CATEGORY: "SET_FILTER_CATEGORY"
      }
    });
  }

  // --- Action Creator Methods ---
  // Implement methods that dispatch the auto-generated actions

  createProduct = (productData) => async (dispatch) => {
    // Dispatch the auto-generated PENDING action
    dispatch(this.createProductPending()); 
    try {
      const response = await request.createProduct(productData); // Assumes 'createProduct' exists in appexa.json
      // Dispatch the auto-generated SUCCESS action
      dispatch(this.createProductSuccess(response)); 
      return response;
    } catch (error) {
      // Dispatch the auto-generated ERROR action
      dispatch(this.createProductError(error?.data || error)); 
      return Promise.reject(error);
    }
  };

  fetchProducts = (params) => async (dispatch) => {
    dispatch(this.fetchProductsPending());
    try {
      const response = await request.getProducts(params); // Assumes 'getProducts' exists in appexa.json
      dispatch(this.fetchProductsSuccess(response));
      return response;
    } catch (error) {
      dispatch(this.fetchProductsError(error?.data || error));
      return Promise.reject(error);
    }
  };

  updateProduct = (productId, updateData) => async (dispatch) => {
    dispatch(this.updateProductPending());
    try {
      // Assumes 'updateProduct' request takes data and URL param
      const response = await request.updateProduct(updateData, { productId }); 
      dispatch(this.updateProductSuccess(response));
      // Optionally: Dispatch fetchProducts to refresh list or handle update locally
      return response;
    } catch (error) {
      dispatch(this.updateProductError(error?.data || error));
      return Promise.reject(error);
    }
  };

  deleteProduct = (productId) => async (dispatch) => {
    dispatch(this.deleteProductPending());
    try {
      // Assumes 'deleteProduct' request takes null body and URL param
      const response = await request.deleteProduct(null, { productId }); 
      dispatch(this.deleteProductSuccess({ productId, ...response })); // Pass productId for potential reducer use
      // Optionally: Refresh list or handle deletion locally
      return response;
    } catch (error) {
      dispatch(this.deleteProductError(error?.data || error));
      return Promise.reject(error);
    }
  };
  
  // --- Custom Action Creators (Optional) ---
  setSearchTerm = (term) => ({
    type: this.constants.SET_SEARCH_TERM,
    data: term
  });

  setFilterCategory = (categoryId) => ({
    type: this.constants.SET_FILTER_CATEGORY,
    data: categoryId
  });

  // --- Custom Reducer Logic (Optional) ---
  // Override handleAction to add custom reducers
  handleAction() {
    // Get the auto-generated handlers from the base class
    const baseActions = super.handleAction(); 

    // Add custom handlers
    const customActions = {
      setSearchTerm: (action, state) => ({
        ...state,
        searchTerm: action.data
      }),
      setFilterCategory: (action, state) => ({
        ...state,
        filterCategory: action.data
      }),
      // Example: Modify state after successful deletion
      deleteProductSuccess: (action, state) => {
        // You might want to filter the deleted item from a list in the state
        // This depends on how you structure your 'fetchProductsSuccess' data
        const updatedState = baseActions.deleteProductSuccess(action, state);
        // Add logic here to remove item with action.data.productId from state.fetchProducts.data if it's an array
        return updatedState; 
      }
    };

    // Merge base and custom handlers
    return {
      ...baseActions,
      ...customActions
    };
  }
}

export default new Products();
```

**2. Register the Module (`src/storeModules/index.js`)**

```jsx
import auth from './auth';
import products from './products'; // Import the new module

export default {
  auth,
  products, // Add it to the export
};
```

## Benefits

-   **Reduced Boilerplate:** Automatically handles the creation of constants, action creators (pending, success, error, reset), initial state slices, and basic reducer logic for each CRUD item.
-   **Consistency:** Enforces a consistent pattern for handling asynchronous CRUD operations.
-   **Extensibility:** Allows adding custom state, constants, actions, and overriding reducer logic easily.

By using the `store.CRUD` class, you can significantly speed up the development of Redux modules that involve standard data manipulation tasks.