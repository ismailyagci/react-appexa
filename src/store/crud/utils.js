export const createObject = (items, callback) => {
  let object = {};
  items.forEach((item) => {
    const newData = callback(item);
    object = {
      ...object,
      ...newData,
    };
  });
  return object;
};

export const generateCrudState = (args, template) => {
  const state = {};
  args.forEach((arg) => (state[arg] = template));
  return state;
};

export const generateCrudConstants = (name) => ({
  [`${name}_PENDING`]: `${name}_PENDING`,
  [`${name}_SUCCESS`]: `${name}_SUCCESS`,
  [`${name}_ERROR`]: `${name}_ERROR`,
  [`${name}_RESET`]: `${name}_RESET`,
});

export const generateCrudActions = (name, crudTemplate) => {
  const updateState = (data, state) => {
    return {
      [name]: {
        ...state[name],
        ...data,
      },
    };
  };

  return {
    [`${name}Pending`]: (data, state) => updateState({ pending: true }, state),
    [`${name}Success`]: (data, state) =>
      updateState(
        { data: data.data, pending: false, error: null, initialSuccess: true },
        state
      ),
    [`${name}Error`]: (data, state) =>
      updateState({ pending: false, error: data.error || data.data }, state),
    [`${name}Reset`]: (data, state) => updateState(crudTemplate, state),
  };
};
