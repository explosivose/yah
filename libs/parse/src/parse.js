import * as yaml from "yaml";
import * as parse5 from "parse5";
import { pino } from "pino";
import * as pug from "pug";
import { parseFrontmatter } from "./parseFrontmatter.js";
import parentLogger from "@yah/logger";

const logger = parentLogger.child({ name: "parse" });

/**
 * @import { DefaultTreeAdapterMap } from 'parse5'
 * @import { Frontmatter } from './parseFrontmatter.js'
 */

/**
 * @typedef {object} YahParsed
 * @property {Frontmatter | undefined} frontmatter
 * @property {DefaultTreeAdapterMap['documentFragment']} template
 */

/**
 *
 * @param {string} input
 * @returns {YahParsed}
 */
export const parse = (input) => {
  const lines = input.split(/(\r?\n)/);
  let frontmatter;
  let fmStop = 0;
  const matchDocMarker = /^---[a-z]*$/;
  if (lines[0] && matchDocMarker.test(lines[0])) {
    // fmStop = lines.indexOf("---", 1);
    fmStop = lines.slice(1).findIndex((line) => line.match(matchDocMarker));
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
 * @param {string[]} input
 * @returns {DefaultTreeAdapterMap["documentFragment"]}
 */
export const parseTemplate = (input) => {
  let htmlTemplate;
  if (input[0] === "---pug") {
    logger.debug("Parsing pug template...");
    htmlTemplate = pug.compile(input.slice(1).join(""))();
  } else {
    logger.debug("Parsing html template...");
    htmlTemplate = input.join("");
  }
  logger.debug(htmlTemplate);
  return parse5.parseFragment(htmlTemplate);
};
