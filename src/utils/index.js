
/**
 * Converts a string to camel case.
 *
 * @param {string} str - The string to convert to camel case.
 * @returns {string} - The converted string in camel case.
 */
export const toCamelCase = (str) => {
  return str.toLowerCase().replace(/_([a-z])/g, (match, letter) => {
    return letter.toUpperCase();
  });
}

export const isObject = (value) => {
  return typeof value === 'object' && value !== null;
}

export const cloneObject = (data) => { 
  return JSON.parse(JSON.stringify(data))
}