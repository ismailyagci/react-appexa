const isEqualArray = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    const item = array1[i];
    if (!array2.includes(item)) {
      return false;
    }
  }

  return true;
};

const schema = (datas, options) => {
  for (const key in datas) {
    const data = datas[key];
    const isEqual = isEqualArray(Object.keys(data), options);
    if (!isEqual) return false;
  }
  return true;
};

export default schema;
