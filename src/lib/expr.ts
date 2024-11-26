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
export class Callable {
	public arity: number = 0;
	public variable_arity: number = 0; // 0 = disabled variable arity.
	call(interpreter: Interpreter, args: LabelledNumber[]): LabelledNumber {
		return {num_value: 0};
	};
}

// EXPRs
export interface Expr {
	type: "BinaryExpr" | "GroupingExpr"
	| "LiteralExpr" | "UnaryExpr"
	| "PostExpr" | "VarExpr"
	| "CallExpr" 
	| "ArrayExpr" | "ArrayIndex" // array index unused.
	| "EquationExpr";
};

export interface Binary extends Expr {
	left: Expr,
	operator: Token,
	right: Expr,
};

export interface ArrayExpr extends Expr {
	elements: Expr[],
	indexer?: Expr,
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
export interface Post extends Expr {
	operator: Token,
	left: Expr,
};

export interface VarExpr extends Expr {
	name: Token, // uses the variable.
	indexer?: Expr,
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
