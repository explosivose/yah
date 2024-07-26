import * as pug from "pug";
import { logger } from "./logger.js";

/**
 *
 * @param {string[]} input
 * @returns {import("./parse.js").TemplateFunction}
 */
export const parseTemplate = (input) => {
  let templateFn;
  if (input[0] === "---pug") {
    logger.debug("Parsing pug template...");
    templateFn = pug.compile(input.slice(1).join(""), {});
  } else {
    logger.debug("Parsing html template...");
    templateFn = () => input.join("");
  }
  logger.debug(templateFn);
  return templateFn;
};
