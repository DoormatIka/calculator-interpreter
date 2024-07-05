import {Callable} from "../lib/expr.js";
import {Interpreter} from "../lib/interpreter.js";

export class Sqrt extends Callable {
	public arity: number = 1;
	constructor() { super(); }
	call(interpreter: Interpreter, args: number[]) {
		return Math.sqrt(args[0]);
	};
}

export class Clock extends Callable {
	public arity: number = 0;
	constructor() { super(); }
	call(interpreter: Interpreter, args: number[]) {
		return performance.now();
	};
}

export class Abs extends Callable {
	public arity: number = 1;
	constructor() { super(); }
	call(interpreter: Interpreter, args: number[]) {
		return Math.abs(args[0])
	};
}
