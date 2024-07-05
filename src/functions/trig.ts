import {Callable} from "../lib/expr.js";
import {Interpreter} from "../lib/interpreter.js";

export class Sine extends Callable {
	public arity: number = 1;
	constructor() { super(); }
	call(interpreter: Interpreter, args: number[]) {
		return Math.sin(args[0]);
	};
}
export class Cosine extends Callable {
	public arity: number = 1;
	constructor() { super(); }
	call(interpreter: Interpreter, args: number[]) {
		return Math.cos(args[0]);
	};
}
export class Tangent extends Callable {
	public arity: number = 1;
	constructor() { super(); }
	call(interpreter: Interpreter, args: number[]) {
		return Math.tan(args[0]);
	};
}
export class Log extends Callable {
	public arity: number = 1;
	constructor() {super();}
	call(interpreter: Interpreter, args: number[]) {
		return Math.log(args[0]);
	};
}
export class Base2Log extends Callable {
	public arity: number = 1;
	constructor() {super();}
	call(interpreter: Interpreter, args: number[]) {
		return Math.log2(args[0]);
	};
}
export class Base10Log extends Callable {
	public arity: number = 1;
	constructor() {super();}
	call(interpreter: Interpreter, args: number[]) {
		return Math.log10(args[0]);
	};
}




