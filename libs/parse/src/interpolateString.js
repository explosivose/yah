import { variables } from "./variables.js";

/**
 * @param {string} placeholder
 * @param {string} key
 * @returns
 */
const replace = (placeholder, key) => {
  const value = variables.get(key);
  if (!value) {
    return placeholder;
  }
  return String(value);
};

const braceRegex = /\${(\d+|[a-z$_][\w\-$]*?(?:\.[\w\-$]*?)*?)}/gi;
/**
 * @param {string} value
 * @returns {string}
 */
export const interpolateString = (value) => {
  if (typeof value === "string") {
    return value.replace(braceRegex, replace);
  }
  return value;
};
