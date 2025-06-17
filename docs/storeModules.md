# Store Module Example: Authentication (`/docs/storeModules.md`)

This document provides a detailed example of creating an authentication store module using the patterns encouraged by `react-appexa`. While it doesn't explicitly use the `store.CRUD` base class (as authentication isn't strictly CRUD), it demonstrates the core concepts of defining state, constants, actions, and asynchronous logic within a module class.

**Note:** This example predates the formal `store.CRUD` class documentation but follows similar principles.

## 1. Module Definition (`src/storeModules/auth/index.jsx`)

First, define the `Auth` class and export an instance.

```jsx
import { request } from 'react-appexa'; // Import request for API calls

class Auth {
  // Define a key for storing login data in localStorage
  localStorageLoginKey = 'appexaAuthToken';

  // --- State --- 
  get state() {
    const tokenData = localStorage.getItem(this.localStorageLoginKey);
    // Set the auth header immediately if token exists
    if (tokenData) {
      try {
        const { token } = JSON.parse(tokenData);
        if (token) {
          request.setHeader("x-access-token", token);
        }
      } catch (e) {
        console.error("Failed to parse auth token from localStorage", e);
        localStorage.removeItem(this.localStorageLoginKey);
      }
    }
    
    // Initial state based on token presence
    return {
      pending: false,       // General pending state for login/verify
      isLogin: !!tokenData, // Are we potentially logged in?
      error: null,          // Stores login/verify error messages
      verifyPending: !!tokenData // Are we currently verifying an existing token?
    };
  }

  // --- Constants --- 
  get constants() {
    return {
      VERIFY_TOKEN_SUCCESS: "VERIFY_TOKEN_SUCCESS",
      VERIFY_TOKEN_ERROR: "VERIFY_TOKEN_ERROR", // Added for completeness
      LOGIN_PENDING: "LOGIN_PENDING",
      LOGIN_SUCCESS: "LOGIN_SUCCESS",
      LOGIN_ERROR: "LOGIN_ERROR",
      LOGOUT: "LOGOUT"
    };
  }

  // --- Action Creators --- 
  // Simple functions returning action objects
  verifyTokenSuccess = () => ({
    type: this.constants.VERIFY_TOKEN_SUCCESS
  });

  verifyTokenError = () => ({ // Added for completeness
    type: this.constants.VERIFY_TOKEN_ERROR
  });

  loginPending = () => ({
    type: this.constants.LOGIN_PENDING
  });

  loginSuccess = (data) => ({ // Often doesn't need data if token is handled separately
    type: this.constants.LOGIN_SUCCESS,
    data // Could potentially pass user profile data here
  });

  loginError = (errorMessage) => ({
    type: this.constants.LOGIN_ERROR,
    data: errorMessage // Pass error message as data
  });

  logout = () => ({
    type: this.constants.LOGOUT
  });

  // --- Thunk Actions (Asynchronous Logic) ---

  // Action to handle user login
  login = (email, password) => async (dispatch) => {
    dispatch(this.loginPending());
    try {
      // Assumes 'login' endpoint is defined in appexa.json
      const response = await request.login({ email, password }); 
      // Assuming response.data contains the token upon success
      const token = response?.data?.accessToken; // Adjust based on actual API response
      if (!token) {
        throw new Error(response?.message || "Login failed: No token received");
      }
      // Set header for subsequent requests
      request.setHeader("x-access-token", token);
      // Store token data (consider storing more than just the token if needed)
      localStorage.setItem(this.localStorageLoginKey, JSON.stringify({ token }));
      // Dispatch success action
      dispatch(this.loginSuccess(response.data)); // Pass user data if available
      return response.data;
    } catch (error) {
      const message = error?.data?.message || error?.message || "Login failed";
      dispatch(this.loginError(message));
      // Clear potentially invalid token info if login fails
      localStorage.removeItem(this.localStorageLoginKey);
      request.setHeader("x-access-token", "");
      return Promise.reject(message);
    }
  };

  // Action to verify an existing token (e.g., on app load)
  verifyToken = () => async (dispatch, getState) => {
    const tokenDataString = localStorage.getItem(this.localStorageLoginKey);
    if (!tokenDataString) {
      // No token, ensure logged out state
      dispatch(this.logout()); 
      return; 
    }

    let token;
    try {
      token = JSON.parse(tokenDataString).token;
      if (!token) throw new Error("Invalid token data");
    } catch (e) {
      // Invalid token data in storage
      localStorage.removeItem(this.localStorageLoginKey);
      dispatch(this.logout());
      return;
    }
    
    // If token exists, it should already be set in the header by initial state logic
    // We still might be in verifyPending state initially
    // Assume 'verifyToken' endpoint exists in appexa.json
    try {
      // This request might just return success/failure or updated user info
      const response = await request.verifyToken(); // May not need to send token if header is set
      dispatch(this.verifyTokenSuccess()); // Update state: verification done, user is logged in
      return response.data;
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem(this.localStorageLoginKey);
      request.setHeader("x-access-token", "");
      dispatch(this.verifyTokenError()); // Dispatch specific error
      dispatch(this.logout()); // Also dispatch logout to reset state fully
      return Promise.reject(error);
    }
  };

  // Action to handle user logout
  logoutUser = () => (dispatch) => {
    localStorage.removeItem(this.localStorageLoginKey);
    request.setHeader("x-access-token", "");
    dispatch(this.logout());
  };

  // --- Reducer Logic --- 
  handleAction() {
    return {
      // Handler for LOGIN_PENDING action type
      loginPending: (action, state) => ({
        ...state,
        pending: true,
        error: null, // Clear previous errors
        isLogin: false // Not logged in yet
      }),
      // Handler for LOGIN_SUCCESS action type
      loginSuccess: (action, state) => ({
        ...state,
        pending: false,
        isLogin: true,
        error: null,
        verifyPending: false // Login implies verification
        // You might store user data from action.data here
        // user: action.data?.user
      }),
      // Handler for LOGIN_ERROR action type
      loginError: (action, state) => ({
        ...state,
        pending: false,
        isLogin: false,
        error: action.data, // Store the error message
        verifyPending: false
      }),
      // Handler for VERIFY_TOKEN_SUCCESS action type
      verifyTokenSuccess: (action, state) => ({
        ...state,
        isLogin: true,
        verifyPending: false,
        error: null
      }),
       // Handler for VERIFY_TOKEN_ERROR action type
      verifyTokenError: (action, state) => ({
        ...state,
        verifyPending: false,
        error: "Token verification failed" // Or more specific error
      }),
      // Handler for LOGOUT action type
      logout: (action, state) => ({
        ...state,
        pending: false,
        isLogin: false,
        error: null,
        verifyPending: false
        // Clear user data
        // user: null 
      })
    };
  }
}

export default new Auth();
```

## 2. Register the Module (`src/storeModules/index.jsx`)

Ensure the exported instance is included in your main store module aggregation file.

```jsx
import auth from './auth';
// import other modules...

export default {
  auth,
  // other modules...
};
```

This example illustrates how to structure a store module with state initialization (including side effects like setting headers), constants, action creators, asynchronous thunks interacting with the `request` module and `localStorage`, and reducer logic defined in `handleAction`.