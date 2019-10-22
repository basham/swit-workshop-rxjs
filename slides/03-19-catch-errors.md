# Catch errors

Catch errors with with the [`catchError()` operator](https://rxjs-dev.firebaseapp.com/api/operators/catchError)

```js
import { of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { debug } from '../src/util/rx/debug.js'

of(1, 2, 3, 4, 5).pipe(
  map((n) => {
    if (n === 4) {
      throw 'four!'
    }
    return n
  }),
  catchError((error) => of(`Caught error: ${error.message}`)),
  debug()
).subscribe()

// 1
// 2
// 3
// Caught error: four!
```

Most useful for catching errors from [`ajax()` responses](https://rxjs-dev.firebaseapp.com/api/ajax/ajax)

```js
import { of } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { catchError, filter } from 'rxjs/operators'
import { debug } from '../src/util/rx/debug.js'

const request = 'https://api.github.com/users?per_page=5'
const successfulResponse$ = ajax(request).pipe(
  catchError((error) => of({ error })),
  filter(({ error }) => !error),
  debug('GitHub users')
).subscribe()

// GitHub users
//   [ ... ]
```
