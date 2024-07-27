/**
 * @import { DataSource, DataConnector, GetDataSource, RemoveDataSource, AddDataSource } from "@yah/datasource"
 * @import { Query } from "@yah/parse";
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
import parentLogger from "@yah/logger";
import Database from "better-sqlite3";
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
  type = "better-sqlite3";
  get sources() {
    logger.debug(`Sources: ${this.#sources.size}`);
    return [...this.#sources.keys()];
  }
  /**
   * @type {Map<string, DataSourceSqliteCloud>}
   */
  #sources = new Map();
  /**
   * @type {Map<string, Database.Database>}
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
    const database = new Database(source.connection);
    this.#connections.set(sourceName, database);
  }
  /**
   * @param {QuerySqlite} query
   * @returns {Promise<unknown>}
   */
  async runQuery(query) {
    let database = this.#connections.get(query.source);
    if (!database) {
      this.connect(query.source);
      database = this.#connections.get(query.source);
    }
    if (!database) {
      throw new Error(`No source named ${query.source}`);
    }
    if (query.type === "exec") {
      logger.debug(`Executing ${query.name ? query.name : ""}:\n ${query}`);
      database.exec(query.sql);
      return undefined;
    }
    logger.debug(`Getting ${query.name ? query.name : ""}:\n ${query}`);
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
