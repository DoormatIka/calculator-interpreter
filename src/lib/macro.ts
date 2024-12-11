
import {ASTPrinter} from "./ast_printer.js";
import {CalcError, Stdout} from "./error.js";
import {ArrayExpr, Binary, Call, Expr, Grouping, Literal, Post, PostGrouping, Unary, VarExpr} from "./expr.js";
import {Interpreter} from "./interpreter.js";
import {Token, TokenType, Tokenizer} from "./scanner.js";

type MacroToken = {
	token_type: TokenType,
	text?: string,
	variable?: string, // id.
}
type MacroDefinition = {
	initial: MacroToken[],
	result: MacroToken[],
}

// m!4'5" (the 4'5" part gets passed into the macro.)
// m!4'6" => in(ft(1)) + in(2)
// 
// How it will go?
// 		- m!4'5" will get parsed as a MacroExpr
// 		- the MacroExpander will expand the macro into its AST equivalent.
// 		- here is the pseudo-code for macro parser.
// 		function macro() {
// 			macro = MacroExpr { m: string }
// 			ast_macro = new MacroExpander(macro);
// 			return ast_macro;
// 		}

type MacroState = {start: number, end: number, variable_map: Map<string, number>};

export class MacroExpander {
	constructor(private macros: MacroDefinition[]) {}
	/**
	* Parses the macro.
	*/
	public parseMacros(tokens: Token[]) {
		for (const macro of this.macros) {
			const initial = macro.initial;
			const result_expression = macro.result;
			const m = this.parseMacro(tokens, initial, result_expression);
			if (m) {
				return m;
			}
		}
		return undefined;
	}
	/**
	 * Mutates tokens.
	 */
	public parseMacro(
		tokens: Token[], 
		initial: MacroToken[], 
		result: MacroToken[]
	): Token[] | undefined {
		const noted_macros: MacroState[] = [];

		// Ensure the token and macro lists are compatible in size
		if (tokens.length < initial.length) {
			return undefined; // Not enough tokens to match the macro
		}

		for (let token_index = 0; token_index < tokens.length; token_index++) {
			let match = true;
			const variable_map = new Map<string, number>();
			// concerning for performance ^^.
			for (let macro_index = 0; macro_index < initial.length; macro_index++) {
				const macro_token = initial[macro_index];
				const token = tokens[macro_index + token_index];

				if (macro_token.variable) {
					if (token.literal === undefined || token.type !== TokenType.NUMBER) {
						match = false;
						break;
					}
					variable_map.set(macro_token.variable, token.literal);
				} else if (macro_token.token_type !== token.type || macro_token.text !== token.text) {
					match = false;
					break;
				}
			}

			if (!match) {
				variable_map.clear();
			} else {
				const start = token_index;
				const end = token_index + initial.length;
				const state: MacroState = {start, end, variable_map};
				noted_macros.push(state);
			}
		}

		// replace macros from noted_macros.

		if (noted_macros.length > 0) {
			const t = tokens.slice();
			for (const macro of noted_macros) {
				const r: Token[] = result.map(res_token => {
					if (res_token.variable) {
						const a = macro.variable_map.get(res_token.variable)!;
						const s: Token = {
							type: TokenType.NUMBER,
							text: a.toString(),
							literal: a,
						};
						return s;
					}
					return {
						type: res_token.token_type,
						text: res_token.text ?? "",
						literal: undefined,
					};
				});
				t.splice(macro.start, macro.end - macro.start, ...r);
			}
			return t;
		}
	}

}

class MacroScanner {
	private start = 0;
	private current = 0;
	private tokens: MacroToken[] = [];
	constructor() {}
	public scan() {
		
	}
}

// $ would be the macro variables
// $x'$y" => in(ft($x)) + in($y)

const expander = new MacroExpander([
	{
		initial: [ // implement a scanner for this.
			{token_type: TokenType.NUMBER, variable: "x"},
			{token_type: TokenType.APOSTROPHE, text: "'"},
			{token_type: TokenType.NUMBER, variable: "y"},
			{token_type: TokenType.QUOTATION, text: `"`},
		],
		result: [
			{token_type: TokenType.IDENTIFIER, text: "in"},
			{token_type: TokenType.LEFT_PAREN, text: "("},
				{token_type: TokenType.IDENTIFIER, text: "ft"},
				{token_type: TokenType.LEFT_PAREN, text: "("},
					{token_type: TokenType.NUMBER, variable: "x"},
				{token_type: TokenType.RIGHT_PAREN, text: ")"},
			{token_type: TokenType.RIGHT_PAREN, text: ")"},

			{token_type: TokenType.PLUS, text: "+"},

			{token_type: TokenType.IDENTIFIER, text: "in"},
			{token_type: TokenType.LEFT_PAREN, text: "("},
				{token_type: TokenType.NUMBER, variable: "y"},
			{token_type: TokenType.RIGHT_PAREN, text: ")"},
		],
	},
]);

const input = `lcd(14'90" + 50)`

const out = new Stdout();
const scanner = new Tokenizer(out, input)

const macro = scanner.parse();
const e = expander.parseMacros(macro);

const printer = new ASTPrinter();
printer.clearStr();

console.log(macro, e);
