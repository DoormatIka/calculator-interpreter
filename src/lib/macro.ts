
import { TokenType } from "./scanner";

type MacroType = string | TokenType;

function isMacroLiteral(s: any): s is string {
	return typeof s.length === "string";
}
