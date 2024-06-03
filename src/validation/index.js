import types from "./types";
import defaultMessages from "./messages";
import { returnMessage } from "./utils";

/**
 *   @typedef {("faxNumber" | "phoneNumber" | "schema" | "slug" | "password" | "string" | "number" | "email" | "length" | "required" | "array" | "nestedSlug" | "oneOf" | "isObject")} TypePatterns
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
const validation = (schema = {}, props = {}, messageData) => {
  const messages = messageData || defaultMessages;
  const propNames = Object.keys(schema);

  for (const propName of propNames) {
    const schemaFields = schema[propName] || {};

    const value = props[propName];

    const valueValidate = types.required(value);
    if (schemaFields.optional && !valueValidate) continue;
    if (!valueValidate)
      return returnMessage(
        messages.required(
          schemaFields.fieldTitle,
          value,
          schemaFields.typeOptions
        ),
        propName
      );

    const typeValidate = types[schemaFields.type](
      value,
      schemaFields.typeOptions
    );
    const typeMessage = messages[schemaFields.type];
    if (!typeValidate)
      return returnMessage(
        typeMessage(schemaFields.fieldTitle, value, schemaFields.typeOptions),
        propName
      );
  }

  return {
    status: true,
  };
};
validation.tools = types;
export default validation;
