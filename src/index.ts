
import readline from "node:readline";

import {ASTPrinter} from "./lib/ast_printer.js";
import {Interpreter} from "./lib/interpreter.js";
import {RecursiveDescentParser} from "./lib/parser.js";
import {Tokenizer} from "./lib/scanner.js";
import {CalcError, Stdout} from "./lib/error.js";
import {Cosine, Log, Sine, Tangent, Base2Log, Base10Log, HyperbolicCosine, HyperbolicSine, HyperbolicTangent, InverseHyperbolicCosine, InverseHyperbolicSine, InverseHyperbolicTangent, InverseSine, InverseCosine, InverseTangent} from "./functions/trig.js";
import {Abs, Clock, Sqrt, Ceiling, Floor, Round, Signum, Maximum, Minimum, Cbrt, Num, LCM, GCD, Factor } from "./functions/standard.js";

import {WeightedGraph} from "./lib/graph.js";
import {createConversionFunction} from "./functions/conversion.js";
import { edges } from "./data/units.js";
import {Stmt} from "./lib/expr.js";

// rewrite this into a more low level approach.
// store a string then put characters in there for every keypress
async function* initquestions(query: string) {
	const cli = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	while (true) {
		yield new Promise(res => cli.question(query, res));
	}
}

const graph = new WeightedGraph();
const out = new Stdout();
const calc_err = new CalcError(out);
const interpreter = new Interpreter(out, calc_err);

graph.addJSONEdges(edges);
const measurement_units = graph.getAllNodes();

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
	.add_global("pi", {num_value: Math.PI})
	.add_global("e", {num_value: Math.E})
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
	.add_global("atanh", new InverseHyperbolicTangent())
	.add_global("lcm", new LCM())
	.add_global("gcd", new GCD())
	.add_global("factor", new Factor())

for (const unit of measurement_units) {
	interpreter.add_global(unit, createConversionFunction(unit, graph));
}
const printer = new ASTPrinter();

async function one_time() {
	try {
		const tokenizer = new Tokenizer(out, "a = [1, 2]; a[0];");
		const parsed_tokens = tokenizer.parse();

		const parser = new RecursiveDescentParser(parsed_tokens, calc_err, measurement_units);
		const tree: Stmt[] = parser.parse();
		for (const node of tree) {
			const p = printer.parseStmt(node);
			console.log(p);
		}

		interpreter.interpret(tree);

		console.log(out.get_stdout());
		out.clear_stdout();
		calc_err.resetErrors();
		printer.clearStr();
		interpreter.clear_variables();
	} catch (error) {
		console.log(error);
	}
}

async function run_cli() {
	for await (const answer of initquestions("[!!calc] >> ")) {
		const tokenizer = new Tokenizer(out, answer as string);
		const parsed_tokens = tokenizer.parse();
		const parser = new RecursiveDescentParser(parsed_tokens, calc_err, measurement_units);
		try {
			const tree: Stmt[] = parser.parse();
			for (const node of tree) {
				const p = printer.parseStmt(node);
				console.log(p);
			}
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

// run_cli();
one_time();
