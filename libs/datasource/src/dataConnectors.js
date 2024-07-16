import parentLogger from "@yah/logger";
/**
 * @import { DataSource } from "./dataSources.js"
 */
/**
 * @template {DataSource} D
 * @callback AddDataSource
 * @param {D} input
 */
/**
 * @callback RemoveDataSource
 * @param {string} sourceName
 */
/**
 * @template {DataSource} D
 * @callback GetDataSource
 * @param {string} sourceName
 * @returns {D | undefined}
 */
/**
 * @template T
 * @callback RunQuery
 * @param {string} sourceName
 * @param {string} query
 * @returns {Promise<T>}
 */
/**
 * @template {DataSource} D
 * @typedef {object} DataConnector
 * @property {string} type
 * @property {string[]} sources
 * @property {AddDataSource<D>} add
 * @property {RemoveDataSource} remove
 * @property {GetDataSource<D>} get
 * @property {RunQuery<unknown>} runQuery
 */
const logger = parentLogger.child({ name: "datasource" });
/**
 * @type {DataConnector<DataSource>[]}
 */
const connectors = [];

/**
 * @param {DataConnector<DataSource>} connector
 */
export const addDataConnector = (connector) => {
  logger.debug(`Adding data connector for ${connector.type}`);
  connectors.push(connector);
};

/**
 * @param {string} type
 * @returns {DataConnector<DataSource> | undefined}
 */
export const getDataConnector = (type) => {
  const connector = connectors.find((connector) => connector.type === type);
  return connector;
};

/**
 * @param {string} sourceName
 */
export const getDataConnectorForSource = (sourceName) => {
  logger.debug(`Connectors: ${connectors.length}`);
  const connector = connectors.find((connector) => {
    logger.debug(`Connector: ${connector.type}`);
    return connector.sources.includes(sourceName);
  });
  return connector;
};
