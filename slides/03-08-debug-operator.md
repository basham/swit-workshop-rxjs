# Debug operator

Display the current value in the stream

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
  debug('interval'),
  map((value) => value * 2),
  debug('value * 2')
).subscribe()
```
