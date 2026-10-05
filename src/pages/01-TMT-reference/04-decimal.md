# Decimal

TMT uses `break_eternity.js`'s Decimal class for engine quantities. It supports values far beyond JavaScript's number range.

After reading this page, you'll want to see [Formatting](01/05) for TMT's display helpers and [defineResource](01/03) for using a quantity as currency.

## Values

- `DecimalSource` {type: Decimal | ReadonlyDecimal | number | string}\
Accepted input for Decimal-valued engine fields and operations.
- `Decimal` {type: object}\
A quantity with custom arithmetic and comparison methods. Construct one with `new Decimal(value)`.
- `ReadonlyDecimal` {type: protected Decimal}\
A Decimal exposed through a read context or protected result. Supports calculations, but not changes to itself.

:::tip Write Large Values as Strings
Use text for quantities beyond ordinary-number precision. A value greater than `Number.MAX_VALUE` passed to `new Decimal()` is equivalent to `new Decimal(Infinity)`.

```js
const amount = new Decimal("1e1000");
const doubled = amount.mul(2);
const affordable = doubled.gte("1e999");
```
:::

JavaScript operators such as `+`, `*`, and `>` will coerce values into numbers or strings. Use `.add`, `.mul`, and `.gt` instead.

Calculations can round, especially at enormous values.

## Common Methods

These calls use `value` as the receiver, they return a result rather than mutating `value`.

| Call | Result | Meaning |
| --- | --- | --- |
| `value.add(other)`, `value.plus(other)` | {type: Decimal} | Addition|
| `value.sub(other)`, `value.minus(other)` | {type: Decimal} | Subtraction|
| `value.mul(other)`, `value.times(other)` | {type: Decimal} | Multiplication|
| `value.div(other)` | {type: Decimal} | Division|
| `value.mod(other)` | {type: Decimal} | Modulo (Reduction)|
| `value.pow(other)` | {type: Decimal} | Exponentiation|
| `value.root(other)` | {type: Decimal} | Root of an Arbitrary Degree|
| `value.sqr()`, `value.sqrt()`| {type: Decimal} | Square and Square Root|
| `value.cube()`, `value.cbrt()` | {type: Decimal} | Cube and Cube Root|
| `value.abs()`, `value.neg()`, `value.recip()` | {type: Decimal} | Absolute value, negation, and reciprocation|
| `value.floor()`, `value.ceil()`, `value.round()` | {type: Decimal} | Floor (round down), ceiling (round up), and normal rounding|
| `value.trunc()` | {type: Decimal} | Remove Fractional Values|
| `value.min(other)`, `value.max(other)` | {type: Decimal} | Return the Smallest or Largest Value|
| `value.clamp(minimum, maximum)` | {type: Decimal} | Clamp a Value|
| `value.log10()`, `value.log2()`, `value.ln()` | {type: Decimal} | Logarithm of a Common Base|
| `value.log(base)` | {type: Decimal} | Logarithm of an Arbitrary Base|
| `value.eq(other)`, `value.neq(other)` | {type: boolean} | Equality or Inequality|
| `value.lt(other)`, `value.lte(other)` | {type: boolean} | Less Than (with or without equality)|
| `value.gt(other)`, `value.gte(other)` | {type: boolean} | Greater Than (with or without equality)|
| `value.isFinite()` | {type: boolean} | Whether the Value is Finite|
| `value.isNan()` | {type: boolean} | Whether the Value is NaN|
| `value.toNumber()` | {type: number} | Convert a Decimal to a Number|

Most calculations also have static forms, such as `Decimal.add(left, right)` and `Decimal.max(left, right)`. Static NaN is `Decimal.isNaN`, while the instance method is `isNan`.

## Writing Quantities

Assign the result when updating state:

```js
update(context, delta) {
    const state = context.layerState;
    state.energy = state.energy.add(new Decimal(5).mul(delta));
}
```

This fragment assumes `energy` is not a [Resource](01/03). For tracked layer currency gains, use `context.grantLayerPoints(handle, amount)` so `best` and `total` are updated too.

## Representation and Conversion

Decimal values are encoded by several numerical fields. Editing these fields directly is not recommended. Instead, static `fromNumber`, `fromString`, `fromDecimal`, `fromValue`, `fromMantissaExponent`, and `fromComponents` can be used to construct Decimal values.

## Decimal API Table

The following table groups the remaining relevant Decimal methods.

| Family | Members |
| --- | --- |
| Arithmetic aliases | `subtract`, `multiply`, `divide`, `divideBy`, `dividedBy`, `negate`, `negated`, `reciprocal`, `reciprocate`, `modulo`, `modular` |
| Sign and magnitude comparisons | Static `sign`, `sgn`, `cmpabs`, `compare`, `minabs`, `maxabs`, `clampMin`, `clampMax` |
| Comparison aliases | `equals`, `notEquals`, `lessThan`, `lessThanOrEqualTo`, `greaterThan`, `greaterThanOrEqualTo` |
| Approximate comparisons | `cmp_tolerance`, `compare_tolerance`, `eq_tolerance`, `equals_tolerance`, `neq_tolerance`, `notEquals_tolerance`, `lt_tolerance`, `lte_tolerance`, `gt_tolerance`, `gte_tolerance` |
| Exponents and logarithms | `pLog10`, `absLog10`, `logarithm`, `pow10`, `pow_base`, `exp` |
| Factorial and gamma | `factorial`, `gamma`, `lngamma` |
| Higher operations | `tetrate`, `iteratedexp`, `iteratedlog`, `slog`, `slog_internal`, `layeradd10`, `layeradd`, `lambertw`, `ssqrt`, `linear_sroot`, `pentate`, `penta_log`, `linear_penta_root` |
| Trigonometry | `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sinh`, `cosh`, `tanh`, `asinh`, `acosh`, `atanh` |
| Arithmetic and Geometric costs | Static `affordArithmeticSeries`, `sumArithmeticSeries`, Static `affordGeometricSeries`, `sumGeometricSeries`||
| Inversion | Static `increasingInverse` |

Arithmetic and geometric series helpers can be useful for implementing your own buymax.

Finally, Decimal includes the following constants: `dZero`, `dOne`, `dNegOne`, `dTwo`, `dTen`, `dNaN`, `dInf`, `dNegInf`, `dNumberMax`, `dNumberMin`, `dLayerSafeMax`, `dLayerSafeMin`, `dLayerMax`, and `dLayerMin`.