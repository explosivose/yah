import * as yaml from "yaml";

/**
 *
 * @param {string} input
 */
export const parse = (input) => {
	const lines = input.split(/(\r?\n)/);
	let y;
	if (lines[0] && /---/.test(lines[0])) {
		y = parseYaml(lines);
	}
	return { yaml: y };
};

/**
 *
 * @param {string[]} lines
 */
export const parseYaml = (lines) => {
	const endLine = lines.indexOf("---", 1);
	const yamlText = lines.slice(1, endLine).join("");
	const y = yaml.parse(yamlText);
	return y;
};
