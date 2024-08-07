/**
 * @import { DataSource, DataConnector, GetDataSource, RemoveDataSource, AddDataSource } from "@yah/datasource"
 */
/**
 * @typedef {Object} SqliteSource
 * @property {string} connection
 */
/**
 * @typedef {SqliteSource & DataSource} DataSourceSqliteCloud
 */
/**
 * @typedef {z.infer<typeof QuerySqliteSchema>} QuerySqlite
 */

// @ts-ignore types not yet available for experimental node:sqlite
import { DatabaseSync } from "node:sqlite";
import parentLogger from "@yah/logger";
import { QuerySchema } from "@yah/parse";
import z from "zod";
const QuerySqliteSchema = QuerySchema.extend({
  sql: z.string(),
  type: z.enum(["get", "all", "run", "exec"]),
});

const logger = parentLogger.child({ name: "datasource-sqlite" });

/**
 * @implements {DataConnector<DataSourceSqliteCloud>}
 */
class DataConnectorSqlite {
  /**
   * @readonly
   */
  type = "sqlite";
  get sources() {
    logger.debug(`Sources: ${this.#sources.size}`);
    return [...this.#sources.keys()];
  }
  /**
   * @type {Map<string, DataSourceSqliteCloud>}
   */
  #sources = new Map();
  /**
   * @type {Map<string, DatabaseSync>}
   */
  #connections = new Map();
  /**
   * @type {AddDataSource<DataSourceSqliteCloud>}
   */
  add(source) {
    this.#sources.set(source.name, source);
  }
  /**
   * @type {RemoveDataSource}
   */
  remove(sourceName) {
    this.#sources.delete(sourceName);
  }
  /**
   * @type {GetDataSource<DataSourceSqliteCloud>}
   */
  get(sourceName) {
    return this.#sources.get(sourceName);
  }
  /**
   * @param {string} sourceName
   */
  connect(sourceName) {
    const source = this.get(sourceName);
    if (!source) {
      throw new Error(`No source named ${sourceName}`);
    }
    logger.debug(`Connecting to source ${source.name}`);
    const database = new DatabaseSync(source.connection);
    this.#connections.set(sourceName, database);
  }
  /**
   * @template T
   * @param {QuerySqlite} unparsedQuery
   * @returns {Promise<T | undefined>}
   */
  async runQuery(unparsedQuery) {
    let query;
    try {
      query = QuerySqliteSchema.parse(unparsedQuery);
    } catch (err) {
      logger.error(`Oops with ${JSON.stringify(unparsedQuery, undefined, 2)}`);
      throw err;
    }
    let database = this.#connections.get(query.source);
    if (!database) {
      logger.debug(`Not yet connected to ${query.source}`);
      this.connect(query.source);
      database = this.#connections.get(query.source);
    }
    if (!database) {
      throw new Error(`No source named ${query.source}`);
    }
    if (query.type === "exec") {
      logger.debug(`Executing ${query.name ? query.name : ""}:\n ${query.sql}`);
      database.exec(query.sql);
      return undefined;
    }
    logger.debug(`Getting ${query.name ? query.name : ""}:\n ${query.sql}`);
    const prepared = database.prepare(query.sql);
    let data;
    if (query.type === "all") {
      data = prepared.all();
    } else if (query.type === "get") {
      data = prepared.get();
    } else {
      prepared.run();
    }

    logger.debug(`Got ${JSON.stringify(data, undefined, 2)}`);
    return data;
  }
  /**
   * @param {string} sourceName
   * @returns {Promise<Record<string, unknown>>}
   */
  async describe(sourceName) {
    return {
      data: await this.runQuery({
        type: "all",
        sql: "SELECT name FROM sqlite_master WHERE type = 'table';",
        source: sourceName,
      }),
    };
  }
}

export const dataConnector = new DataConnectorSqlite();
