import { getDataConnectorForSource, getDataSource } from "@yah/datasource";
import parentLogger from "@yah/logger";

/**
 * @import { z } from 'zod'
 * @import { QuerySchema } from '@yah/parse'
 * @typedef {z.infer<typeof QuerySchema>} DataQuery
 */
const logger = parentLogger.child({ name: "data" });

/**
 *
 * @param {DataQuery} query
 */
export const runQuery = (query) => {
  const connector = getDataConnectorForSource(query.source);
  if (!connector) {
    const error = `No connector for ${query.source}`;
    logger.error(error);
    throw new Error(error);
  }
  return connector.runQuery(query.source, query.query);
};
