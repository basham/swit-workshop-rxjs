# Subject

0+ values

Track events

```js
import { Subject } from 'rxjs'
import { debug } from '../src/util/rx/debug.js'

const keydown$ = new Subject()

keydown$.pipe(
  debug('Keydown log')
).subscribe()

const CONTRA_CODE = 'Up Up Down Down Left Right Left Right B A Start'.split(' ')

CONTRA_CODE.forEach((key) => {
  keydown$.next(key)
})

// Keydown log
//   "Up"
//   "Up"
//   "Down"
//   "Down"
//   "Left"
//   "Right"
//   "Left"
//   "Right"
//   "B"
//   "A"
//   "Start"
```

```js
// Instead of `forEach`, try `from`.
// Automatically unsubscribes ("completes")
// when the last item in the array emits.
import { from } from 'rxjs'

from(CONTRA_CODE).subscribe((key) => {
  keydown$.next(key)
})
```

```js
// Push values on a Subject (or BehaviorSubject)
// automatically with `.subscribe(subject$)`.
import { from } from 'rxjs'

from(CONTRA_CODE).subscribe(keydown$)
```
