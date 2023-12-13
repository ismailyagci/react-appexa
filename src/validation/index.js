import types from "./types";
import messages from "./messages";
import { returnMessage } from "./utils";

/**
*   @typedef {("password" | "string" | "number" | "email" | "length" | "required" | "array" | "nestedSlug" | "oneOf" | "isObject")} TypePatterns
*/

/**
*   @typedef ValidationInterface
*   @type {object} 
*   @property {TypePatterns} type 
*   @property {object} typeOptions 
*   @property {string} fieldTitle 
*/

/** 
*  @param {Object<string, ValidationInterface} schema
*/
const validation = (schema = {}, props = {}) => {
  const propNames = Object.keys(schema);

  for (const propName of propNames) {
    const schemaFields = schema[propName] || {};

    const value = props[propName];

    const valueValidate = types.required(value);
    if (!valueValidate) return returnMessage(
      messages.required(schemaFields.fieldTitle, value, schemaFields.typeOptions)
    );
    
    const typeValidate = types[schemaFields.type](value, schemaFields.typeOptions);
    const typeMessage = messages[schemaFields.type];
    if (!typeValidate) return returnMessage(
      typeMessage(schemaFields.fieldTitle, value, schemaFields.typeOptions)
    );
  };

  return {
    status: true
  };
};
validation.tools = types
export default validation;