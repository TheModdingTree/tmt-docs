# Formatting

TMT exports five helpers for displaying quantities and elapsed time.

Shared types used on this page:

- `DecimalSource` {type: Decimal | ReadonlyDecimal | number | string}\
Input accepted by Decimal-valued fields and operations. See [Decimal](01/04) for more information.

## Shared Arguments

- `value` {type: DecimalSource} {required}\
Quantity to be formatted.
- `precision` {type: number} {optional}\
Fractional precision to be shown, if possible. Must be an integer from `0` through `99`. Defaults depend on the helper. Some notation choices use their own precision, described below.

An invalid numeric string follows Decimal parsing and can display `"NaN"`. All helpers below return display text.

## format(value, precision) {type: string}

The general-purpose formatter. `precision` defaults to `2`. Negative values use a leading minus, and zero displays with the requested precision.

The notation varies from value to value. The following table lays out the notations used:

:::note Intervals
If you aren't familiar with interval notation (used in the table below): (x, y) means values from x to y, excluding x and y, while \[x, y] means values from x to y, including x and y.
:::

| Starting value | Display |
| --- | --- |
| (0, 0.0001) | Formatted reciprocal followed by `⁻¹` |
| [0.0001, 1000)| Displayed as itself|
| [1000, 1,000,000)| Displayed with commas|
| [1e6, 1e10000)| Exponential notation|
| [1e10000, 1e1000000)| Exponential notation, no precision |
| [`1e1000000`, eeee1000)| Displayed as simply its exponent|
| [`eeee1000`, ∞)| Displayed with F notation, based on super-logarithm |

F notation uses three decimal places before `F` and the whole super-logarithm after it. Once the super-logarithm reaches `1e6`, the display becomes `F` followed by the formatted whole super-logarithm.

Use `format(value, 0)` for whole-number display. This still allows exponential and reciprocal notation.

Rounding doesn't restart notation selection. This is why a value just below `1000` can display `1000.00` without a comma.

## exponentialFormat(value, precision, showMantissa) {type: string}

Displays a mantissa and exponent. `precision` defaults to `2`.

- `showMantissa` {type: boolean} {optional}\
Controls whether the part before `e` is displayed. Defaults to `true`.

| Call | Result |
| --- | --- |
| `exponentialFormat(0)` | `"0.00e0"` |
| `exponentialFormat(0, 2, false)` | `"e0"` |
| `exponentialFormat(9999.9, 2)` | `"1.00e4"` |
| `exponentialFormat(12345, 2, false)` | `"e4"` |
| `exponentialFormat("1e10000")` | `"1.00e10,000"` |
| `exponentialFormat("1e1000000")` | `"1.00e1.000e6"` |

## commaFormat(value, precision) {type: string}

Displays a value with comma separators. `precision` defaults to `0`. Magnitudes below `0.001` display zero with the requested precision.

If Decimal already produces another notation, the helper keeps it instead of adding commas inside that notation.

| Call | Result |
| --- | --- |
| `commaFormat(12345.678)` | `"12,346"` |
| `commaFormat(12345.678, 2)` | `"12,345.68"` |
| `commaFormat(-12345.6, 1)` | `"-12,345.6"` |
| `commaFormat(0.0001)` | `"0"` |
| `commaFormat("1e100")` | `"1e100"` |

## simpleFormat(value, precision) {type: string}

Displays a value as itself, with the requested precision. `precision` defaults to `2`. Magnitudes below `0.0001` display zero.

| Call | Result |
| --- | --- |
| `simpleFormat(1234.567)` | `"1234.57"` |
| `simpleFormat(0.01234)` | `"0.0123"` |
| `simpleFormat(0.01234, 0)` | `"0"` |
| `simpleFormat(0.00001)` | `"0.00"` |

This doesn't force arbitrarily large quantities into simple notation.

## timeFormat(seconds) {type: string}

Displays elapsed time using seconds, minutes, hours, days, and years.

- `seconds` {type: DecimalSource} {required}\
Elapsed time in seconds. Negative values display zero. Rounds to hundredths before separating units.

A year uses `365` days. Rounding can carry into the next minute, hour, day, or year. There is no precision argument.

| Call | Result |
| --- | --- |
| `timeFormat(-1)` | `"0.00s"` |
| `timeFormat(59.999)` | `"1m 0.00s"` |
| `timeFormat(3661.25)` | `"1h 1m 1.25s"` |
| `timeFormat(86400)` | `"1d 0h 0m 0.00s"` |
| `timeFormat(31536000)` | `"1y 0d 0h 0m 0.00s"` |
| `timeFormat(Infinity)` | `"Infinity"` |
| `timeFormat(-Infinity)` | `"0.00s"` |