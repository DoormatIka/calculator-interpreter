import {RuntimeError} from "../lib/error.js";
import {ArrayType, CalcTypes, Callable, LabelledNumber, isArrayType, isLabelledNumber} from "../lib/expr.js";
import {Interpreter} from "../lib/interpreter.js";
import { factor } from "../lib/math/factor.js";
import { gcd } from "../lib/math/gcd.js";
import { lcm } from "../lib/math/lcm.js";
import {Token, TokenType} from "../lib/scanner.js";

export class Num extends Callable {
	public parameter_types: CalcTypes[] = ["LabelledNumber"];
	constructor() { super(); }
	call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: args[0].num_value, type: undefined }; 
	};
}

export class Sqrt extends Callable {
	public parameter_types: CalcTypes[] = ["LabelledNumber"];
	constructor() { super(); }
	call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: Math.sqrt(args[0].num_value), type: args[0].type }; 
	};
}

export class Cbrt extends Callable {
	public parameter_types: CalcTypes[] = ["LabelledNumber"];
	constructor() { super(); }
	call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: Math.cbrt(args[0].num_value), type: args[0].type }; 
	};
}


export class Clock extends Callable {
	public parameter_types: CalcTypes[] = [];
	constructor() { super(); }
	call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: performance.now(), type: undefined }; 
	};
}

export class Abs extends Callable {
	public parameter_types: CalcTypes[] = ["LabelledNumber"];
	constructor() { super(); }
	call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: Math.abs(args[0].num_value), type: args[0].type }; 
	};
}

export class Ceiling extends Callable {
	public parameter_types: CalcTypes[] = ["LabelledNumber"];
    constructor() { super(); }
    call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: Math.ceil(args[0].num_value), type: args[0].type }; 
    };
}

export class Floor extends Callable {
	public parameter_types: CalcTypes[] = ["LabelledNumber"];
    constructor() { super(); }
    call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: Math.floor(args[0].num_value), type: args[0].type }; 
    };
}

export class Round extends Callable {
	public parameter_types: CalcTypes[] = ["LabelledNumber"];
    constructor() { super(); }
    call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: Math.round(args[0].num_value), type: args[0].type }; 
    };
}

export class Signum extends Callable {
	public parameter_types: CalcTypes[] = ["LabelledNumber"];
    constructor() { super(); }
    call(interpreter: Interpreter, args: LabelledNumber[]) {
		// sign and signum isn't the same.
		return { num_value: Math.sign(args[0].num_value), type: args[0].type }; 
    };
}

export class Maximum extends Callable {
	public minimum_arity: number = 2;
	public variable_parameter_type: CalcTypes = "LabelledNumber";
    constructor() { super(); }
    call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: Math.max(...args.map(c => c.num_value)), type: args[0].type };
    };
}

export class Minimum extends Callable {
	public minimum_arity: number = 2;
	public variable_parameter_type: CalcTypes = "LabelledNumber";
    constructor() { super(); }
    call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: Math.min(...args.map(c => c.num_value)), type: args[0].type }; 
    };
}


export class Factor extends Callable {
	public parameter_types: CalcTypes[] = ["LabelledNumber"];
	constructor() {super();}
	call(interpreter: Interpreter, args: LabelledNumber[]): ArrayType {
		const factors = factor(args[0].num_value).map(c => {return {num_value: c, type: args[0].type}});
		factors.sort((prev, curr) => prev.num_value - curr.num_value);
		return { elements: factors };
	}
}

export class Sum extends Callable { // needs support for both "LabelledNumber" *and* "ArrayType"???
	public parameter_types: CalcTypes[] = ["ArrayType"];

	constructor() {super();}
	call(interpreter: Interpreter, args: ArrayType[]): LabelledNumber {
		let sum = 0;
		for (const arg of args[0].elements) {
			if (isLabelledNumber(arg)) {
				sum += arg.num_value;
			}
		}
		return {num_value: sum};
	};
}

export class Union extends Callable {
	public minimum_arity: number = 2;
	public variable_parameter_type: CalcTypes = "ArrayType";

	constructor() {super();}
	call(interpreter: Interpreter, args: ArrayType[]): ArrayType {
		const union: LabelledNumber[] = [];

		// Add all elements from the first array
		for (const element of args[0].elements) {
			union.push(element);
		}

		// Add elements from the second array if they are not already in the union
		for (const element of args[1].elements) {
			const exists = union.some(e => e.num_value === element.num_value);
			if (!exists) {
				union.push(element);
			}
		}

		return { elements: union };
	};
}

export class Intersection extends Callable {
	public minimum_arity: number = 2;
	public variable_parameter_type: CalcTypes = "ArrayType";

	constructor() {super();}
	call(interpreter: Interpreter, args: ArrayType[]): ArrayType {
		const intersection: LabelledNumber[] = []; // Initialize the intersection array

		// Check each element of the first array against the second array
		for (const element of args[0].elements) {
			const existsInSecond = args[1].elements.some(e => e.num_value === element.num_value);
			const alreadyInIntersection = intersection.some(e => e.num_value === element.num_value);

			if (existsInSecond && !alreadyInIntersection) {
				intersection.push(element);
			}
		}

		return { elements: intersection };
	};
}

export class GCD extends Callable {
	public minimum_arity: number = 2;
	public variable_parameter_type: CalcTypes = "LabelledNumber";
	constructor() {super();}
	call(interpreter: Interpreter, args: LabelledNumber[]): LabelledNumber | ArrayType {
		let result = args[0].num_value;
		for (let i = 1; i < args.length; i++) {
			result = gcd(result, args[i].num_value);
		}
		return { num_value: result, type: args[0].type };
	}
}

export class LCM extends Callable {
	public minimum_arity: number = 2;
	public variable_parameter_type: CalcTypes = "LabelledNumber";
	constructor() {super();}
	call(interpreter: Interpreter, args: LabelledNumber[]): LabelledNumber | ArrayType {
		let result = args[0].num_value;
		for (let i = 1; i < args.length; i++) {
			result = lcm(result, args[i].num_value);
		}
		return { num_value: result, type: args[0].type };
	}
}

