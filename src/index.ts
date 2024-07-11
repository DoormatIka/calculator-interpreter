import chalk from "chalk";
import readline from "node:readline";

import {ASTPrinter} from "./lib/ast_printer.js";
import {Interpreter} from "./lib/interpreter.js";
import {RecursiveDescentParser} from "./lib/parser.js";
import {TokenType, Tokenizer} from "./lib/scanner.js";
import {CalcError, RuntimeError, Stdout} from "./lib/error.js";
import {Cosine, Log, Sine, Tangent, Base2Log, Base10Log, HyperbolicCosine, HyperbolicSine, HyperbolicTangent, InverseHyperbolicCosine, InverseHyperbolicSine, InverseHyperbolicTangent, InverseSine, InverseCosine, InverseTangent} from "./functions/trig.js";
import {Abs, Clock, Sqrt, Ceiling, Floor, Round, Signum, Maximum, Minimum, Cbrt, Num } from "./functions/standard.js";

import fs from "node:fs";
import {WeightedGraph} from "./lib/graph.js";
import {Callable, LabelledNumber, WeightType} from "./lib/expr.js";
import {createConversionFunction} from "./functions/conversion.js";

async function* initquestions(query: string) {
	const cli = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	while (true) {
		yield new Promise(res => cli.question(query, res));
	}
}

const measurement_units: WeightType[] = [
	"kg", "g", "dg", "cg", "mg", "mcg", "ng",
	"st", "qr", "lb", "ston", "lton", "mton",
];
const graph = new WeightedGraph();
const out = new Stdout();
const calc_err = new CalcError(out);
const interpreter = new Interpreter(out, calc_err);

graph // metric weights
	.addEdge("kg", "g", 1000)
	.addEdge("g", "dg", 10)
	.addEdge("g", "cg", 100)
	.addEdge("g", "mg", 1000)
	.addEdge("g", "mcg", 1e+6)
	.addEdge("g", "ng", 1e+9);
graph // imperial to metric weight
	.addEdge("lb", "g", 453.5924);
graph // imperial weights
	.addEdge("st", "lb", 14)
	.addEdge("qr", "lb", 28)
	// different types of tons
	.addEdge("ston", "lb", 2000) // ton/short ton
	.addEdge("lton", "lb", 2240) // long ton
	.addEdge("mton", "lb", 2204.623) // metric ton
interpreter
	// Standard Functions
	.add_global("clock", new Clock())
	.add_global("num", new Num()) // removes the label
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
for (const unit of measurement_units) {
	interpreter.add_global(unit, createConversionFunction(unit, graph));
}
const printer = new ASTPrinter();

async function run_cli() {
	for await (const answer of initquestions("[!!calc] >> ")) {
		const tokenizer = new Tokenizer(out, answer as string);
		const parsed_tokens = tokenizer.parse();
		const parser = new RecursiveDescentParser(parsed_tokens, calc_err, measurement_units);
		try {
			const tree = parser.parse();
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
	const parser = new RecursiveDescentParser(parsed_tokens, calc_err, measurement_units);
	try {
		const tree = parser.parse();
		if (tree && !calc_err.getHasError()) {
			interpreter.interpret(tree);
		}
	} catch (error: unknown) {
		console.log(error);
	}

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

run_cli();
// runFileInterpreter();
