import { runQuery } from "@yah/data";
import { addDataConnector, addDataSource } from "@yah/datasource";
import { dataConnector } from "@yah/datasource-sqlitecloud";
import { parse } from "@yah/parse";
import fs from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import parentLogger from "@yah/logger";

/**
 * @import { YahParsed } from "@yah/parse"
 */

/**
 * logger
 */
const logger = parentLogger.child({ name: "poc" });

const THIS_FILE = fileURLToPath(import.meta.url);
const YAHS_DIR = `${dirname(THIS_FILE)}/yahs`;

const init = () => {
  addDataConnector(dataConnector);
};

/**
 *
 * @param {YahParsed} yah
 */
const firstPass = (yah) => {
  if (yah.frontmatter?.dataSource) {
    logger.debug(`firstPass ${yah.frontmatter.dataSource.name}`);
    addDataSource(yah.frontmatter.dataSource);
  }
};

/**
 *
 * @param {YahParsed} yah
 */
const secondPass = async (yah) => {
  if (yah.frontmatter?.query) {
    const data = await runQuery(yah.frontmatter.query);
    console.log(data);
  }
};

const main = async () => {
  init();
  const blogRaw = await fs.readFile(`${YAHS_DIR}/blog.yah`);
  const blogDbRaw = await fs.readFile(`${YAHS_DIR}/blog-db.yah`);
  const yahs = [blogRaw, blogDbRaw].map((raw) => parse(raw.toString()));
  for (const yah of yahs) {
    firstPass(yah);
  }
  for (const yah of yahs) {
    await secondPass(yah);
  }
};
main();
