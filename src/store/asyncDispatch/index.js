import { isObject } from "../../utils";
import { getStore } from "../index";

export const withForward = (callback) => {
  if (typeof callback !== "function") throw new Error("withForward function fist argument must be a function.");
  return {
    withForward: true,
    callback
  };
}

const asyncDispatch = async (...actions) => {
  const actionsResponses = [];
  const store = getStore();

  for (const action of actions) {
    if (!isObject(action)) {
      const actionResponse = await store.dispatch(action)
      actionsResponses.push(actionResponse)
    }
    if (action.withForward) {
      const actionResponse = await store.dispatch(action.callback(actionsResponses[actionsResponses.length - 1]));
      actionsResponses.push(actionResponse)
    }
  }

  return actionsResponses;
};
export default asyncDispatch;