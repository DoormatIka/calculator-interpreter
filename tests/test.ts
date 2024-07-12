import fs from "fs";
import url from "url";
import path from "path";

import { WeightedGraph } from "../src/lib/graph.js";
import { edges } from "../src/data/units.js";
import chalk from "chalk";

function expected<T>(name: string) {
	return (compared: T) => {
		return {
			toBe: (to_value: T) => {
				const failure = chalk.gray(`Input(${compared}) !== Matching(${to_value})`);
				if (compared === to_value) {
					console.log(`${chalk.greenBright("[/]")} Test ${name} success.`);
				} else {
					console.log(`${chalk.redBright("[X]")} Test ${name} fail.\n\t${failure}`);
				}
			}
		};
	}
};

function convert(from: string, to: string, num: number) {
	const path = graph.bfs(from, to) ?? [];
	const edgesInPath = graph.getEdgesFromPath(path);
	let converted = structuredClone(num);
	for (const edge of edgesInPath) {
		converted *= edge.weight;
	}
	return converted;
}

const graph = new WeightedGraph();
graph.addJSONEdges(edges);

const kg_g = convert("kg", "g", 100)
const kg_lb = convert("kg", "lb", 20)
const qr_ston = convert("qr", "ston", 2.5);

expected("Kilograms to Grams")(kg_g).toBe(100000);
expected("Kilograms to Pounds")(kg_lb).toBe(44.09245);
expected("UK Quarter to Short Ton")(qr_ston).toBe(0.035);

