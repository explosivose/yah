import { interpolateString } from "./interpolateString.js";

/**
 *
 * @param {{[key: string]: unknown}} obj
 * @param {string} stack
 */
const interpolateObjectValues = (obj, stack) => {
  for (const propertyKey in obj) {
    if (Object.hasOwn(obj, propertyKey)) {
      const property = obj[propertyKey];
      if (typeof property === "string") {
        obj[propertyKey] = interpolateString(property);
      } else if (typeof property === "object" && property !== null) {
        // @ts-ignore
        interpolateObjectValues(obj[propertyKey], `${stack}.${propertyKey}`);
      }
    }
  }
};

/**
 * @param {{[key: string]: unknown}} obj
 */
export const interpolateValues = (obj) => {
  interpolateObjectValues(obj, "");
};
