import { Database } from "@sqlitecloud/drivers";
import parentLogger from "@yah/logger";
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
   * @param {string} sourceName
   * @param {string} query
   * @returns {Promise<T>}
   */
  runQuery(sourceName, query) {
    let database = this.#connections.get(sourceName);
    if (!database) {
      this.connect(sourceName);
      database = this.#connections.get(sourceName);
    }
    if (!database) {
      throw new Error(`No source named ${sourceName}`);
    }
    return database.sql(query);
  }
}

export const dataConnector = new DataConnectorSqliteCloud();
