import {Callable, LabelledNumber} from "../lib/expr.js";
import {WeightedGraph} from "../lib/graph.js";
import {Interpreter} from "../lib/interpreter.js";
import { RuntimeError } from "../lib/error.js";
import { TokenType } from "../lib/scanner.js";
import { CalcTypes } from "../lib/expr.js";


export function createConversionFunction(fn_name: string, graph: WeightedGraph): Callable {
    const c = class extends Callable {
		public parameter_types: CalcTypes[] = ["LabelledNumber"];
        call(interpreter: Interpreter, args: LabelledNumber[]) {
			if (args[0].type === undefined) {
				const r = structuredClone(args[0]);
				r.type = fn_name; // assuming the function name would point to a number type. (which it should.)
				return r;
			}
            const path = graph.bfs(args[0].type, fn_name);
			if (path === null) {
				throw new RuntimeError({
					type: TokenType.NUMBER,
					text: args[0].num_value.toString(),
					literal: args[0].num_value
				}, `Can't convert from ${args[0].type} to ${fn_name}.`);
			}
			const edgesInPath = graph.getEdgesFromPath(path);
			let converted = structuredClone(args[0].num_value);
			for (const edge of edgesInPath) {
				converted *= edge.weight;
			}
            return { num_value: converted, type: fn_name };
        }
    };
	return new c();
}
