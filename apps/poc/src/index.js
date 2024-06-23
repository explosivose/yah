import { parse } from "@yah/parse";
import fs from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const THIS_FILE = fileURLToPath(import.meta.url);
const YAHS_DIR = `${dirname(THIS_FILE)}/yahs`;

const main = async () => {
	const data = await fs.readFile(`${YAHS_DIR}/blog.yah`);
	console.log(parse(data.toString()));
};
main();
