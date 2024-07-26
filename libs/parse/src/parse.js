import { parseFrontmatter } from "./parseFrontmatter.js";
import { logger } from "./logger.js";
import { parseTemplate } from "./parseTemplate.js";
import { variables } from "./variables.js";

/**
 * @import { DefaultTreeAdapterMap } from 'parse5'
 * @import { Frontmatter } from './parseFrontmatter.js'
 */

/**
 * @typedef {(data: Record<string, unknown>) => string} TemplateFunction
 */

/**
 * @typedef {object} YahParsed
 * @property {string} name
 * @property {Frontmatter | undefined} frontmatter
 * @property {TemplateFunction} templateFn
 */

/**
 *
 * @param {string} input
 * @param {string} name
 * @returns {YahParsed}
 */
export const parse = (input, name) => {
  return variables.createContext(() => {
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
    const templateFn = parseTemplate(templateLines);
    return { frontmatter, templateFn, name };
  });
};
