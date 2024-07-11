import chalk from "chalk";
import readline from "node:readline";

import {ASTPrinter} from "./lib/ast_printer.js";
import {Interpreter} from "./lib/interpreter.js";
import {RecursiveDescentParser} from "./lib/parser.js";
import {Tokenizer} from "./lib/scanner.js";
import {CalcError, ParseError, RuntimeError, Stdout} from "./lib/error.js";
import {Callable} from "./lib/expr.js";
import {Cosine, Log, Sine, Tangent, Base2Log, Base10Log, HyperbolicCosine, HyperbolicSine, HyperbolicTangent, InverseHyperbolicCosine, InverseHyperbolicSine, InverseHyperbolicTangent, InverseSine, InverseCosine, InverseTangent} from "./functions/trig.js";
import {Abs, Clock, Sqrt, Ceiling, Floor, Round, Signum, Maximum, Minimum, Cbrt } from "./functions/standard.js";

import fs from "node:fs";
import {WeightedGraph} from "./lib/graph.js";


async function* initquestions(query: string) {
	const cli = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	while (true) {
		yield new Promise(res => cli.question(query, res));
	}
}

const out = new Stdout();
const calc_err = new CalcError(out);
const interpreter = new Interpreter(out, calc_err);
interpreter
	.add_global("clock", new Clock())
	// Math Functions
	.add_global("sin", new Sine())
	.add_global("cos", new Cosine())
	.add_global("tan", new Tangent())
	.add_global("log", new Log())
	.add_global("log2", new Base2Log())
	.add_global("log10", new Base10Log())
	.add_global("sqrt", new Sqrt())
	.add_global("cbrt", new Cbrt())
	.add_global("abs", new Abs())
	.add_global("pi", { num_value: Math.PI })
	.add_global("e", { num_value: Math.E })
	.add_global("ceil", new Ceiling())
	.add_global("floor", new Floor())
	.add_global("round", new Round())
	.add_global("signum", new Signum())
	.add_global("max", new Maximum())
	.add_global("min", new Minimum())
	.add_global("asin", new InverseSine())
	.add_global("acos", new InverseCosine())
	.add_global("atan", new InverseTangent())
	.add_global("cosh", new HyperbolicCosine())
	.add_global("sinh", new HyperbolicSine())
	.add_global("tanh", new HyperbolicTangent())
	.add_global("acosh", new InverseHyperbolicCosine())
	.add_global("asinh", new InverseHyperbolicSine())
	.add_global("atanh", new InverseHyperbolicTangent());
const printer = new ASTPrinter();

async function run_cli() {
	for await (const answer of initquestions("[!!calc] >> ")) {
		const tokenizer = new Tokenizer(out, answer as string);
		const parsed_tokens = tokenizer.parse();
		// console.log("Tokenized: \n", parsed_tokens);
		const parser = new RecursiveDescentParser(parsed_tokens, calc_err);

		try {
			const tree = parser.parse();
			// console.log("Parsed: \n", printer.parseStmt(tree[0]));
			
			if (tree && !calc_err.getHasError()) {
				interpreter.interpret(tree);
			}
		} catch (error: unknown) {}

		console.log(out.get_stdout());
		out.clear_stdout();
		calc_err.resetErrors();
		printer.clearStr();
		interpreter.clear_variables();
	}
}

function interpretFile(filename: string) {
	const data = fs.readFileSync(`./benchmarks/${filename}`, { encoding: "utf8" });
	const tokenizer = new Tokenizer(out, data);
	const parsed_tokens = tokenizer.parse();
	const parser = new RecursiveDescentParser(parsed_tokens, calc_err);
	try {
		const tree = parser.parse();
		if (tree && !calc_err.getHasError()) {
			interpreter.interpret(tree);
		}
	} catch (error: unknown) {}

	console.log(out.get_stdout());
	out.clear_stdout();
	calc_err.resetErrors();
	interpreter.clear_variables();
}

async function runFileInterpreter() {
	for await (const file of initquestions("[import file] >> ")) {
		console.log("Running: " + chalk.bgYellow(chalk.black(file)));
		interpretFile(file as string);
	}
}

const graph = new WeightedGraph<number>();
graph.addNode("A");
graph.addNode("B");
graph.addNode("C");
graph.addNode("D");
graph.addNode("E");

graph.addEdge("A", "B", 5);
graph.addEdge("B", "D", 2.3);
graph.addEdge("B", "C", 1.67);
graph.addEdge("D", "E", 4.3);

const path = graph.bfs("A", "E") ?? [];
// returns the path (a list of nodes).
console.log(path);
// i want to access their edges to get their weight.
const edgesInPath = graph.getEdgesFromPath(path);

// how do i do this?
console.log(edgesInPath);

graph.printGraph();

// run_cli();
