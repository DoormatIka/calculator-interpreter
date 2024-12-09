# Calculator
Hello! This is used in the Kogasa discord bot that has been my side project
for my entire university life.

Calculator runs on Recursive Descent Parsing, and interprets based on that.
Why recursive descent? It's fast enough.

Why TS/JS? I was supposed to move from JS to Rust, but I realize that I would have to
do some FFI business with Rust and JS (because my bot was made in JS). 
I'm not dealing with that. >_>

Calculator is fast enough already. (I have no proper benchmarks to back this up.)


A weird quirk of this is it treats variables as an identifier and checks at runtime if its a function or value.

I *would* change it to determine at parsing but then I break everything with not many benefits to the change.
(Well, error messages would be more helpful?)


## Usage
```js
// Semicolons are optional when there's only one statement.
1 + 1 // 2
1 + 1; // 2

// If there's multiple statements though, you need semicolons.
i = 1; i + 1; // 2
// Else, it errors out.
i = 1 i + 1 // Error: Unknown measurement type. [at 'i']

// It also auto prints the last statement. These two lines of code are the same.
1 + 1; 2 + 2; // 4
1 + 1; p 2 + 2; // 4
// You can print multiple times.
p 1 + 1; p 2 + 2;
// 2
// 4

-sqrt(4) // -2

sqrt(4)^2 // 4

4 root 6^4 // 6

2^2 root 68^4 // 68

rt = 3!; result = rt root 729; p result; // 3

g(10lb) // converting 10 pounds to grams, prints 4535.924g

1/8 // 1/8 (0.125)

0.8 // 4/5 (0.8)

// array support for lcd & gcd functions.
p [1, 2]; // [1,2]
a = [5, 6, 7]; p a[1]; // 6
```

## Syntax (Last item executes last)
1. Unary `-1`
2. Parenthesis `((1 + 1) * 2)` and Absolute `|-6^4 + 2|`
3. Exponent `6^4;`
4. Factorial `6.4!;`
5. nth Root `n root m;`
6. Multiplication, Division `(*, /)`
7. Addition, Subtraction `(+, -)`
8. Print `p 6;`

## Functions & Variables
- Pi Value `pi;`
- Euler's Number `e;`
- Square Root `sqrt(1);`
- Cube Root `cbrt(1);`
- Absolute Value `abs(1);`
- Ceiling, Floor, Round to nearest integer `ceil(1.764); floor(5.32); round(543.32);`
- Sin, Cos, Tan `sin(5); cos(5); tan(5);`
- Sinh, Cosh, Tanh `sinh(5); cosh(5), tanh(5);`
- Asin, Acos, Atan `asin(5); acos(5); atan(5);`
- Asinh, Acosh, Atanh `acosh(5); asinh(5); atanh(5);`
- Log, Log2, Log10 `log(5); log2(5); log10(5);`
- Max, Min of any numbers `max(5, 10); min(1, 0, 5);`
- LCM, GCD of any numbers `lcm(10, 20, 3); gcd(9, 56);`
- Factor a number `factor(60);`
- Sum of an array `sum([1, 6, 90]);`
- Union & Intersection of an array `union([1, 2], [2, 5]); intersection([1, 2, 5], [90, 1, 2]);`

## Supported Units
### Weight
- `Metric: kg (kilogram), g (gram), dg (decigram), cg (centigram), mg (milligram), mcg (microgram), ng (nanogram)`
- `Imperial: lb (pounds), st (stone), qr (quarter), ston (short ton), lton (long ton), mton (metric ton)`
### Height
- `Metric: km (kilometer), m (meter), mm (millimeter), cm (centimeter)`
- `Imperial: in (inches), nmi (nautical miles), ft (feet), yd (yard), mi (mile)`

## Doing
- Support `cm(5'6"); p 5'6";`

## Missing Features
- Round by n decimals. `2 round 10.5237`
- Pushing values into equations `no idea how syntax would look like here.`
- Algebra `simplify [x^2 + 5 = 0];`
- Graphing `graph [6^2];`
- Calculus `derive [x^6]` `integrate [x^6]` (big question mark here.)
- Chaining `graph derive simplify [x^2 + 5 = 0];`

## Improvements
- Misspellings should be detected. "Did you mean [variable name]?"

## Installation
Please `npm install`, `npx tsc` and `node build/index.js`.
