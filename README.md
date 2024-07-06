# Calculator

## Usage
```
p 1 + 1; // 2
i = 1; p i + 1; // 2

1 + 1; 2 + 2; // prints nothing.

p sqrt(4); // 2
p sqrt(4)^2; // 4
```

## Syntax
- Print `p 6;`
- Basic Calculations (+, -, *, /) `1 + 1;`
- Factorial `6.4!;`
- Exponent `6^4;`
- Pi Value `pi;`
- Euler's Number `e;`
- Parenthesis `((1 + 1) * 2)`;

## Functions
- Square Root `sqrt(1);`
- Absolute Value `abs(1);` // i might make it into its own syntax `|1|`
- Ceiling, Floor, Round to nearest integer `ceil(1.764); floor(5.32); round(543.32);`
- Sin, Cos, Tan `sin(5); cos(5); tan(5);`
- Sinh, Cosh, Tanh `sinh(5); cosh(5), tanh(5);`
- Asinh, Acosh, Atanh `acosh(5); asinh(5); atanh(5)`;
- Log, Log2, Log10 `log(5); log2(5); log10(5);`
- Max, Min of two numbers `max(5, 10); min(1, 0);` // might make this into its own syntax `5>10`?

## Improvements
- Misspellings should be detected. "Did you mean [variable name]?"

## Installation
Please `npm install`, `npx tsc` and `node build/index.js`.

### Dev Notes
Hello! This is used in the Kogasa discord bot that has been my side project
for my entire university life.

Calculator runs on Recursive Descent Parsing, and interprets based on that.
Why recursive descent? It's fast enough.

Why TS/JS? I was supposed to move from JS to Rust, but I realize that I would have to
do some FFI business with Rust and JS (because my bot was made in JS). 
I'm not dealing with that. >_>

Calculator is fast enough already. (I have no proper benchmarks to back this up.)

Note #1:

A weird quirk of this is it treats variables as an identifier and checks at runtime if its a function or value.

I *would* change it to determine at parsing but then I break everything with not many benefits to the change.
(Well, error messages would be more helpful?)
