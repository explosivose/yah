import * as yaml from "yaml";
import * as parse5 from "parse5";
import { pino } from "pino";
import * as pug from "pug";

const logger = pino({
  name: "parse",
  level: process.env.LOG_LEVEL || "info",
  enabled: process.env.DEBUG?.includes("yah/parse"),
});

/**
 *
 * @param {string} input
 */
export const parse = (input) => {
  const lines = input.split(/(\r?\n)/);
  let frontmatter;
  let fmStop = 0;
  if (lines[0] && /---/.test(lines[0])) {
    fmStop = lines.indexOf("---", 1);
    const fmText = lines.slice(1, fmStop).join("");
    frontmatter = parseFrontmatter(fmText);
    logger.debug({ msg: JSON.stringify(frontmatter) });
  }
  const templateLines = lines.slice(fmStop + 1);
  const template = parseTemplate(templateLines);
  return { frontmatter, template };
};

/**
 *
 * @param {string} input
 */
export const parseFrontmatter = (input) => {
  // TODO: schema validation for frontmatter
  // TODO: @typedef for frontmatter
  const y = yaml.parse(input);
  return y;
};

/**
 *
 * @param {string[]} input
 * @returns {import("parse5").DefaultTreeAdapterMap["documentFragment"]}
 */
export const parseTemplate = (input) => {
  let htmlTemplate;
  if (input.includes("pug")) {
    logger.debug("Parsing pug template...");
    htmlTemplate = pug.compile(
      input
        .filter((line) => line !== "pug")
        .slice(1)
        .join(""),
    )();
  } else {
    logger.debug("Parsing html template...");
    htmlTemplate = input.join("");
  }
  logger.debug(htmlTemplate);
  return parse5.parseFragment(htmlTemplate);
};
