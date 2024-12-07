
import { gcd } from "./gcd.js";

export function lcm(a: number, b: number): number {
	return (a * b) / gcd(a, b);
}
