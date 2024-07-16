import parentLogger from "@yah/logger";
import {
  getDataConnector,
  getDataConnectorForSource,
} from "./dataConnectors.js";

/**
 * @import { z } from 'zod'
 * @import { DataSourceSchema } from '@yah/parse'
 * @typedef {z.infer<typeof DataSourceSchema>} DataSource
 */

const logger = parentLogger.child({ name: "datasource" });

/**
 *
 * @param {DataSource} source
 */
export const addDataSource = (source) => {
  const connector = getDataConnector(source.type);
  if (!connector) {
    const error = `No data connector for data source of type ${source.type}`;
    logger.error(error);
    throw new Error(error);
  }
  logger.debug(`Adding data source ${source.name} (${source.type})`);
  connector.add(source);
};

/**
 * @param {string} name
 */
export const getDataSource = (name) => {
  const connector = getDataConnectorForSource(name);
  return connector?.get(name);
};
