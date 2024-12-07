
export function gcd(a: number, b: number) {
	let i = 0;
    while (b !== 0) {
        [a, b] = [b, a % b];
		i++;
    }
    return Math.abs(a);
}
