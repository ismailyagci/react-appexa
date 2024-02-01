const typesMessages = {
  id: (fieldTitle, value) =>
    `${fieldTitle} parameter should be of type id. (${value}).`,
  password: (fieldTitle, value) =>
    `${fieldTitle} parameter should be of type password. (${value}).`,
  string: (fieldTitle, value) =>
    `${fieldTitle} parameter should be a string. (${value})`,
  number: (fieldTitle, value) =>
    `${fieldTitle} parameter should be a number. (${value})`,
  email: (fieldTitle, value) =>
    `${fieldTitle} parameter should be an email. (${value})`,
  length: (fieldTitle, value, options) => {
    let lengthText = "";
    lengthText = `${lengthText} ${options.min ? options.min : 0} to `;
    lengthText = `${lengthText} ${
      options.max ? options.max : "∞"
    } should be in between.`;
    return `${fieldTitle} parameter's length ${lengthText} (${value})`;
  },
  required: (fieldTitle, value) =>
    `${fieldTitle} parameter should be provided (${value})`,
  array: (fieldTitle, value) =>
    `${fieldTitle} parameter should be in array format (${value})`,
  nestedSlug: (fieldTitle, value) =>
    `${fieldTitle} parameter should be in slug format (${value})`,
  slug: (fieldTitle, value) =>
    `${fieldTitle} parameter should be in slug format (${value})`,
  schema: (fieldTitle, value, typeOptions) =>
    `${fieldTitle} parameter did not match with ${JSON.stringify(
      typeOptions
    )} schema. (${JSON.stringify(value)})`,
  phoneNumber: (fieldTitle, value) =>
    `${fieldTitle} parameter should be a phoneNumber (${value})`,
  faxNumber: (fieldTitle, value) =>
    `${fieldTitle} parameter should be a faxNumber (${value})`,
};

export default typesMessages;
