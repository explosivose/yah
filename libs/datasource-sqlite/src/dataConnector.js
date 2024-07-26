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
import { DatabaseSync } from "node:sqlite";
import parentLogger from "@yah/logger";

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
    const database = new DatabaseSync(source.connection);
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
    return database.exec(query);
  }
}

export const dataConnector = new DataConnectorSqlite();
