# Debug operator

Goal: Display the current value in the stream

Solution: Pair the `tap()` operator with `console.log()`

[`tap()` operator](https://rxjs-dev.firebaseapp.com/api/operators/tap): Perform side effects without modifying the stream

```js
import { tap } from 'rxjs/operators'

export const debug = (message = '') =>
  tap((value) => {
    console.group(message)
    console.log(value)
    console.groupEnd()
  })
```

```js
import { debug } from '../src/util/rx/debug.js'

interval(1000).pipe(
  debug('A'),
  map((value) => value * 2),
  debug('B')
).subscribe()

/*
Console output:

A
  0
B
  0

A
  1
B
  2

A
  2
B
  4
*/
```
