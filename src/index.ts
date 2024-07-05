import chalk from "chalk";
import readline from "node:readline";

import {ASTPrinter} from "./lib/ast_printer.js";
import {Interpreter} from "./lib/interpreter.js";
import {RecursiveDescentParser} from "./lib/parser.js";
import {Tokenizer} from "./lib/scanner.js";
import {CalcError, ParseError, RuntimeError, Stdout} from "./lib/error.js";
import {Callable} from "./lib/expr.js";
import {Cosine, Log, Sine, Tangent, Base2Log, Base10Log} from "./functions/trig.js";
import {Abs, Clock, Sqrt} from "./functions/standard.js";

import fs from "node:fs";


async function* initquestions(query: string) {
	const cli = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	while (true) {
		yield new Promise(res => cli.question(query, res));
	}
}
async function run_cli() {
	const out = new Stdout();
	const err = new CalcError(out);
	const interpreter = new Interpreter(out, err);
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
		.add_global("abs", new Abs())
		.add_global("pi", Math.PI)
		.add_global("e", Math.E);

	const printer = new ASTPrinter();

	for await (const answer of initquestions("[!!calc] >> ")) {
		const tokenizer = new Tokenizer(out, answer as string);
		const parsed_tokens = tokenizer.parse();
		const parser = new RecursiveDescentParser(parsed_tokens, err);

		try {
			const tree = parser.parse();
			
			if (tree && !err.getHasError()) {
				interpreter.interpret(tree);
			}
		} catch (error: unknown) {}

		console.log(out.get_stdout());
		out.clear_stdout();
		err.resetErrors();
		printer.clearStr();
		interpreter.clear_variables();
	}
}

function interpretFile(filename: string) {
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
		.add_global("abs", new Abs())
		.add_global("pi", Math.PI)
		.add_global("e", Math.E);
	

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

run_cli();
