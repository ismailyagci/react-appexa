
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import asyncDispatch, { withForward } from "./asyncDispatch";
import { toCamelCase } from "../utils";
import CRUD from "./crud";
import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import container from '../container';

let store;

const getStore = () => {
  return store;
};

const createStoreModules = (modules) => {
  const isDevelopment = container.get("isDevelopment")
  const middleware = [thunkMiddleware];
  
  if(isDevelopment) {
    middleware.push(loggerMiddleware);
  }

  const reducers = {};
  const createReducer = (container) => {
    return (state = container.state, action) => {
      const reducerActions = container?.handleAction ? container.handleAction() : {};
      const reducerMethodName = toCamelCase(action.type);
      if (reducerActions[reducerMethodName]) {
        const methodResponse = reducerActions[reducerMethodName](action, state);
        return {
          ...state,
          ...methodResponse
        };
      }
      return state;
    };
  };

  const containerKeys = Object.keys(modules);
  containerKeys.forEach((key) => {
    const container = modules[key];
    reducers[key] = createReducer(container);
  });

  if (store) return store;
  const rootReducer = combineReducers(reducers)
  return createStore(rootReducer, applyMiddleware(...middleware));;
};


export const StoreProvider = ({ children, modules }) => {
  store = createStoreModules(modules);
  return <Provider store={store}>
    {children}
  </Provider>
};

export {
  getStore,
  CRUD,
  useDispatch,
  useSelector,
  withForward,
  asyncDispatch
}