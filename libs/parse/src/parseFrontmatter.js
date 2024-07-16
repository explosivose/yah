import { z } from "zod";
import * as yaml from "yaml";

export const DataSourceSchema = z.object({
  name: z.string(),
  type: z.string(),
  connection: z.string(),
});

export const QuerySchema = z.object({
  name: z.optional(z.string()),
  source: z.string(),
  out: z.string(),
  query: z.string(),
});

export const FrontmatterSchema = z.object({
  dataSource: z.optional(DataSourceSchema),
  query: z.optional(QuerySchema),
});

/**
 * @typedef {z.infer<typeof FrontmatterSchema>} Frontmatter
 */

/**
 * @param {string} input
 */
export const parseFrontmatter = (input) => {
  const y = yaml.parse(input);
  const validated = FrontmatterSchema.parse(y);
  return validated;
};
