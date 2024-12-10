import {Interpreter} from "./interpreter.js";
import {Token} from "./scanner.js";

// data types.
export interface LabelledNumber {
	num_value: number,
	type?: string,
}
export interface ArrayType {
	elements: LabelledNumber[],
}

export type CalcTypes = "LabelledNumber" | "ArrayType" | "Any";
export class Callable {
	public minimum_arity: number = 0; // 0 = disabled any parameter counts
	public variable_parameter_type: CalcTypes = "LabelledNumber";
	public parameter_types: CalcTypes[] = [];

	call(interpreter: Interpreter, args: (LabelledNumber | ArrayType)[]): LabelledNumber | ArrayType {
		return {num_value: 0};
	};
}

export function isArrayType(num: Expr | LabelledNumber | Callable | number | ArrayType): num is ArrayType {
	return (num as ArrayType).elements !== undefined;
}
export function isLabelledNumber(num: Expr | LabelledNumber | Callable | number | ArrayType): num is LabelledNumber {
	return (num as LabelledNumber).num_value !== undefined;
}

// EXPRs
export interface Expr {
	type: "BinaryExpr" | "GroupingExpr"
	| "LiteralExpr" | "UnaryExpr"
	| "PostExpr" | "VarExpr"
	| "CallExpr" 
	| "ArrayExpr" | "PostGrouping" // array index unused.
	| "EquationExpr";
};

export interface Binary extends Expr {
	left: Expr,
	operator: Token,
	right: Expr,
};

export interface ArrayExpr extends Expr {
	elements: Expr[],
};

export interface Grouping extends Expr {
	operator: Token,
	expression: Expr,
};
export interface Literal extends Expr {
	value: number,
	label?: string,
};
export interface Unary extends Expr {
	operator: Token,
	right: Expr,
};
export interface PostGrouping extends Expr { // (left)[index]
	index: Expr,
	left: Expr,
}
export interface Post extends Expr {
	operator: Token,
	left: Expr,
};

export interface VarExpr extends Expr {
	name: Token,
}
export interface Call extends Expr {
	callee: Expr,
	paren: Token,
	arguments: Expr[],
}



// Statements
export interface Stmt {
	type: "Expression" | "Var" | "Print"
}

export interface Expression extends Stmt {
	expression: Expr
}
export interface Print extends Stmt {
	expression: Expr
}
export interface VarStmt extends Stmt { // declares a variable.
	name: Token,
	initializer: Expr,
}

export function isExprStmt(num: Stmt): num is Expression {
	return num.type === "Expression"
}
export function isPrintStmt(num: Stmt): num is Print {
	return num.type === "Print"
}
export function isVarStmt(num: Stmt): num is VarStmt {
	return num.type === "Var"
}
