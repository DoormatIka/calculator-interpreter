
import {Callable, LabelledNumber} from "../../lib/expr.js";
import {Interpreter} from "../../lib/interpreter.js";




// this is what i will pass to the interpreter.
//
// this kinda goes against my plan of kg => lbs
// 		then it becomes kg => g => lbs
function createConversionClass(conversionLogic: (num: number) => number): typeof Callable {
    return class extends Callable {
        public arity: number = 1;
        call(interpreter: Interpreter, args: LabelledNumber[]) {
            const convertedValue = conversionLogic(args[0].num_value);
            return { num_value: convertedValue, type: args[0].type };
        }
    };
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
