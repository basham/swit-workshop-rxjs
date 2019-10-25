# Library files

## Utilities

### Array

#### `isArrayEqual`

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

#### `randomItem`

Return a random item from an array.

```
randomItem(source: Array): any
```

```js
import { randomItem } from '/lib/util/array.js'

randomItem([ 1, 2, 3 ])
// Either: 1, 2, or 3
```

#### `range`

Generate an array of sequential numbers given a size. Optionally, start the sequence from a given start number.

```
range(size: Number, [startAt: Number]): Array
```

```js
import { range } from '/lib/util/array.js'

range(3)
// [ 0, 1, 2 ]

range(3, 2)
// [ 2, 3, 4 ]
```

### Math

#### `random`

Generate a random number within a given range.

```
random(min: Number, max: Number): Number
```

```js
import { random } from '/lib/util/math.js'

random(0, 4)
// Either: 0, 1, 2, 3, or 4
```
