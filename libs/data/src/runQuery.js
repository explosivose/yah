import { getDataConnectorForSource, getDataSource } from "@yah/datasource";
import parentLogger from "@yah/logger";

/**
 * @import { z } from 'zod'
 * @import { Query } from '@yah/parse'
 */
const logger = parentLogger.child({ name: "data" });

/**
 *
 * @param {Query} query
 */
export const runQuery = async (query) => {
  const connector = getDataConnectorForSource(query.source);
  if (!connector) {
    const error = `No connector for ${query.source}`;
    logger.error(error);
    throw new Error(error);
  }
  const data = connector.runQuery(query);
  return data;
};
