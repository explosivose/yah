/**
 * @import { Frontmatter, TemplateFunction, YahParsed } from '@yah/parse'
 */
import { runQuery } from "@yah/data";
import { addDataSource } from "@yah/datasource";
import parentLogger from "@yah/logger";
import { interpolateValues } from "../../../libs/parse/src/interpolateObjectValues.js";

export class Yah {
  /**
   * @type {string}
   */
  #name;

  /**
   * @type {Frontmatter | undefined}
   */
  #fm;

  /**
   * @type {TemplateFunction}
   */
  #templateFn;

  #logger;

  /**
   * @param {YahParsed} yah
   */
  constructor(yah) {
    this.#name = yah.name;
    this.#fm = yah.frontmatter;
    this.#templateFn = yah.templateFn;
    this.#logger = parentLogger.child({ name: this.#name });
  }

  registerDataSources() {
    if (this.#fm?.dataSource) {
      this.#logger.debug("Adding data source");
      addDataSource(this.#fm.dataSource);
    }
  }

  async runInitQuery() {
    if (this.#fm?.query?.init) {
      this.#logger.debug(`Running init query ${this.#fm.query.name}`);
      return this.#runQuery();
    }
  }

  async runQuery() {
    if (this.#fm?.query && !this.#fm?.query?.init) {
      return this.#runQuery();
    }
  }

  render() {}

  async #runQuery() {
    if (this.#fm?.query) {
      const queryBody = structuredClone(this.#fm.query);
      interpolateValues(queryBody);
      this.#logger.debug(JSON.stringify(queryBody, undefined, 2));
      const queryResult = await runQuery(queryBody);
      this.#logger.debug(queryResult);
      return queryResult;
    }
  }
}
