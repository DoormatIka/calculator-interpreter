
import { Token, TokenType } from "./scanner";

type MacroTokenType = {
	token_type: TokenType,
	variable?: string, // id.
}
type MacroDefinition = {
	initial: MacroTokenType[],
	result: MacroTokenType[],
}

class MacroExpander {
	constructor(private macros: MacroDefinition[]) {}
	/**
	* Parses the macro.
	*/
	public parse(tokens: Token[]) {
		for (const token of tokens) {
			for (const {initial, result} of this.macros) {
				
				for (const {token_type, variable} of initial) {
					if (token.type !== token_type) {
						break;
					} else {
						// flag here to say that the macro matches with something.
						// grab the "relevant information" ("relevant" needs to be defined in the macros array)
					}
				}

			}
		}
	}
}

// $ would be the macro variables
// $x'$y" => in(ft($x)) + in($y)
const expander = new MacroExpander([
	{ 
		initial: [ // implement a scanner for this.
			{ token_type: TokenType.NUMBER, variable: "x" },
			{ token_type: TokenType.APOSTROPHE },
			{ token_type: TokenType.NUMBER, variable: "y" },
			{ token_type: TokenType.QUOTATION },
		],
		result: [
			{ token_type: TokenType.NUMBER, variable: "x" },
			{ token_type: TokenType.APOSTROPHE },
			{ token_type: TokenType.NUMBER, variable: "y" },
			{ token_type: TokenType.QUOTATION },
		]
	},
]);

// macro definitions
// [NUMBER APOSTROPHE NUMBER QUOTATION] => [NUMBER ADD NUMBER]
