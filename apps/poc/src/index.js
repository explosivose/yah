import { runQuery } from "@yah/data";
import { addDataConnector, addDataSource } from "@yah/datasource";
import sqliteCloudSource from "@yah/datasource-sqlitecloud";
import sqliteSource from "@yah/datasource-sqlite";
import { parse } from "@yah/parse";
import fs from "node:fs/promises";
import { basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import parentLogger from "@yah/logger";
import { Yah } from "./yah.js";

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
  addDataConnector(sqliteSource);
  addDataConnector(sqliteCloudSource);
};

/**
 *
 * @param {string} filePath
 */
const readRawYah = async (filePath) => {
  return {
    rawYah: await fs.readFile(filePath),
    name: basename(filePath),
  };
};

const main = async () => {
  init();
  const blogRaw = await readRawYah(`${YAHS_DIR}/blog.yah`);
  const blogDbRaw = await readRawYah(`${YAHS_DIR}/blog-db.yah`);
  const blogDbInit = await readRawYah(`${YAHS_DIR}/blog-db-init.yah`);
  const yahs = [blogRaw, blogDbRaw, blogDbInit].map(
    (raw) => new Yah(parse(raw.rawYah.toString(), raw.name)),
  );
  for (const yah of yahs) {
    yah.registerDataSources();
  }
  for (const yah of yahs) {
    await yah.runInitQuery();
  }
  for (const yah of yahs) {
    await yah.runQuery();
  }
};
main();
