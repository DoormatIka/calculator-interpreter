
import {Callable, LabelledNumber} from "../../lib/expr.js";
import {Interpreter} from "../../lib/interpreter.js";

class ConverterFunctionBuilder {
	private measurements: Callable[] = [];
	constructor() {}
	addMeasurement(fn_name: string, arity: number, call: (interpreter: Interpreter, args: LabelledNumber[]) => LabelledNumber) {

	}
}

export class ToKilograms extends Callable {
	public arity: number = 1;
	constructor() { super(); }
	call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: args[0].num_value, type: args[0].type }; 
	};
}

export class ToGrams extends Callable {
	public arity: number = 1;
	constructor() { super(); }
	call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: args[0].num_value, type: args[0].type }; 
	};
}

export class ToPounds extends Callable {
	public arity: number = 1;
	constructor() { super(); }
	call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: args[0].num_value, type: args[0].type }; 
	};
}

export class ToTons extends Callable {
	public arity: number = 1;
	constructor() { super(); }
	call(interpreter: Interpreter, args: LabelledNumber[]) {
		return { num_value: args[0].num_value, type: args[0].type }; 
	};
}
