/**
 * @import { DataSource, DataConnector, GetDataSource, RemoveDataSource, AddDataSource } from "@yah/datasource"
 */
/**
 * @typedef {Object} SqliteCloudSource
 * @property {string} connection
 */
/**
 * @typedef {SqliteCloudSource & DataSource} DataSourceSqliteCloud
 */
/**
 * @typedef {z.infer<typeof QuerySqliteSchema>} QuerySqlite
 */
import { Database } from "@sqlitecloud/drivers";
import parentLogger from "@yah/logger";
import { QuerySchema } from "@yah/parse";
import z from "zod";

const QuerySqliteSchema = QuerySchema.extend({
  sql: z.string(),
  type: z.enum(["get", "all", "run", "exec"]),
});
const logger = parentLogger.child({ name: "datasource-sqlitecloud" });

/**
 * @implements {DataConnector<DataSourceSqliteCloud>}
 */
class DataConnectorSqliteCloud {
  /**
   * @readonly
   */
  type = "sqlitecloud";
  get sources() {
    logger.debug(`Sources: ${this.#sources.size}`);
    return [...this.#sources.keys()];
  }
  /**
   * @type {Map<string, DataSourceSqliteCloud>}
   */
  #sources = new Map();
  /**
   * @type {Map<string, Database>}
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
    return new Promise((resolve, reject) => {
      /**
       * @param {Error | null} err
       * @param {T} data
       */
      const callback = (err, data) => {
        if (err) {
          reject(err);
        } else {
          logger.debug(`Got ${JSON.stringify(data, undefined, 2)}`);
          resolve(data);
        }
      };
      if (query.type === "all") {
        prepared.all(callback);
      } else if (query.type === "get") {
        prepared.get(callback);
      } else {
        prepared.run(callback);
      }
    });
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

export const dataConnector = new DataConnectorSqliteCloud();
