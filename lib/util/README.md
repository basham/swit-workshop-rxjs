# Utilities

## Array

### `isArrayEqual`

Check if the contents of two arrays are equal.

```
isArrayEqual(a: Array, b: Array): Boolean
```

```js
import { isArrayEqual } from '/lib/util/array.js'

isArrayEqual([ 1, 2, 3 ], [ 1, 2, 3 ])
// true

isArrayEqual([ 1, 2, 3 ], [ 1, 2 ])
// false
```

### `randomItem`

Return a random item from an array.

```
randomItem(source: Array): any
```

```js
import { randomItem } from '/lib/util/array.js'

randomItem([ 1, 2, 3 ])
// Either: 1, 2, or 3
```

### `range`

Generate an array of sequential numbers given a size. Optionally, start the sequence from a given start number.

```
range(size: Number, startAt?: Number): Array
```

```js
import { range } from '/lib/util/array.js'

range(3)
// [ 0, 1, 2 ]

range(3, 2)
// [ 2, 3, 4 ]
```

## Dice

### `decodeFormula`

Translate a dice formula in the format of `<diceCount>d<faceCount>` into an array of `DiceStruct` objects.

```
decodeFormula(formula: String): Array of DiceSet

DiceSet: { dieCount: Number, faceCount: Number, notation: String, type: String }
```

```js
import { decodeFormula } from '/lib/util/dice.js'

decodeFormula('2d6 1d20')
// [
//   { dieCount: 0, faceCount: 4, notation: '0d4', type: 'd4' },
//   { dieCount: 2, faceCount: 6, notation: '2d6', type: 'd6' },
//   { dieCount: 0, faceCount: 8, notation: '0d8', type: 'd8' },
//   { dieCount: 0, faceCount: 10, notation: '0d10', type: 'd10' },
//   { dieCount: 0, faceCount: 12, notation: '0d12', type: 'd12' },
//   { dieCount: 1, faceCount: 20, notation: '1d20', type: 'd20' }
// ]
```

### `encodeFormula`

Translate an array of `DiceSet` objects to a string equivalent.

```
encodeFormula(diceSets: Array of DiceSet): String

DiceSet: { dieCount: Number, faceCount: Number }
```

```js
import { decodeFormula } from '/lib/util/dice.js'

const diceSets = [
  { dieCount: 2, faceCount: 6 },
  { dieCount: 1, faceCount: 20 }
]
encodeFormula(diceSets)
// '2d6 1d20'
```

## DOM

See [`/lib/util/dom/`](./dom/).

## Math

### `random`

Generate a random number within a given range.

```
random(min: Number, max: Number): Number
```

```js
import { random } from '/lib/util/math.js'

random(0, 4)
// Either: 0, 1, 2, 3, or 4
```

## Rx

See [`/lib/util/rx/`](./rx/).

## Use

### `useCallbackStack`

Add functions to a stack and call them in batch later.

```
useCallbackStack(): [ add: Function, call: Function ]
```

```js
import { useCallbackStack } from '/lib/util/use.js'

const [ add, call ] = useCallbackStack()

const a = () => console.log('Called "a"')
const b = () => console.log('Called "b"')

add(a)
add(b)

call()

// Called "a"
// Called "b"
```
