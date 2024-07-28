import * as pug from "pug";
import { logger } from "./logger.js";
import { interpolateString } from "./interpolateString.js";

/**
 *
 * @param {string[]} input
 * @returns {import("./parse.js").TemplateFunction}
 */
export const parseTemplate = (input) => {
  let templateFn;
  if (input[0] === "---pug") {
    logger.debug("Parsing pug template...");
    templateFn = pug.compile(input.slice(1).join(""), {
      debug: true,
    });
  } else {
    logger.debug("Parsing html template...");
    const template = input.slice(1).join("");
    templateFn = () => {
      return interpolateString(template);
    };
  }
  return templateFn;
};
