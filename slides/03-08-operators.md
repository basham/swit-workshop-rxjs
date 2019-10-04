# Operators

[150+ operators](https://rxjs.dev/api)

Workarounds? "There's an operator for that."

```js
// Static operators
import { interval } from 'rxjs'
// Pipeable operators
import { map, takeWhile, withLatestFrom } from 'rxjs/operators'

const countdown$ = interval(duration).pipe(
  withLatestFrom(count$),
  map(([ , count ]) => count - 1),
  takeWhile((count) => count >= 0)
)
```
