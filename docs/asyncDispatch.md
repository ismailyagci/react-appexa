# Asynchronous Dispatch Utilities (`/src/store/asyncDispatch/index.js`)

`react-appexa` provides utilities to help manage sequences of asynchronous Redux actions, particularly when the result of one action is needed as input for the next.

## `asyncDispatch(...actions)`

This function allows you to dispatch multiple actions (including thunks) sequentially, waiting for each one to complete before dispatching the next.

-   **Parameters:**
    -   `...actions`: A sequence of Redux actions or thunk functions to dispatch.
-   **Returns:** (Promise<Array<any>>) A promise that resolves with an array containing the results (return values) of each dispatched action in the order they were executed.
-   **Usage:**
    Useful when you need to ensure a specific order of operations, like fetching initial data before fetching related data.

    ```javascript
    import { asyncDispatch } from 'react-appexa';
    import { fetchUserAction, fetchUserPostsAction } from './store/actions'; // Example actions

    async function loadUserProfile(userId) {
      try {
        // Dispatch fetchUserAction first, then fetchUserPostsAction
        const [userResponse, postsResponse] = await asyncDispatch(
          fetchUserAction(userId),
          fetchUserPostsAction(userId) // Assumes this action doesn't need data from the first
        );
        
        console.log("User fetched:", userResponse);
        console.log("Posts fetched:", postsResponse);

      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    }
    ```

## `withForward(callback)`

This helper function is used *within* an `asyncDispatch` call to create an action step that depends on the result of the *immediately preceding* action in the sequence.

-   **Parameters:**
    -   `callback`: (Function) A function that receives the result of the previous action as its argument and must return a new Redux action or thunk function.
-   **Returns:** (Object) An object `{ withForward: true, callback: callback }` which is recognized by `asyncDispatch`.
-   **Usage:**
    Use `withForward` when the input for an action depends on the successful completion and result of the previous action.

    ```javascript
    import { asyncDispatch, withForward } from 'react-appexa';
    import { loginAction, fetchUserProfileAfterLoginAction } from './store/actions'; // Example actions

    async function handleLogin(credentials) {
      try {
        const [loginResult, profileResult] = await asyncDispatch(
          // 1. Dispatch the login action
          loginAction(credentials),
          
          // 2. Use withForward to dispatch the next action
          //    The callback receives the result of loginAction
          withForward((loginResponse) => {
            // Check if login was successful and get user ID
            if (loginResponse && loginResponse.success && loginResponse.userId) {
              // Return the next action, passing the userId from the previous step
              return fetchUserProfileAfterLoginAction(loginResponse.userId);
            } else {
              // Optionally return an action to handle login failure or null
              console.error("Login failed, cannot fetch profile.");
              // Returning null or a specific failure action might be appropriate
              // For simplicity, we might just let it throw or handle error outside
              throw new Error("Login failed"); 
            }
          })
        );

        console.log("Login successful:", loginResult);
        console.log("Profile fetched:", profileResult);

      } catch (error) {
        console.error("Login or profile fetch failed:", error);
      }
    }
    ```

## How it Works

`asyncDispatch` iterates through the provided actions.

1.  If an action is a standard Redux action or thunk, it `await store.dispatch(action)` it and stores the result.
2.  If an action object has `withForward: true`, `asyncDispatch` takes the result from the *most recently completed* action in the sequence and passes it to the `action.callback` function.
3.  It then `await store.dispatch()` the action returned by the `callback` and stores its result.

This mechanism allows for creating dependent asynchronous workflows within Redux in a more structured way.