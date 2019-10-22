# Automatically unsubscribe

Some operators automatically emit "complete" notifications, triggering an unsubscribe

[`of()` operator](https://rxjs-dev.firebaseapp.com/api/index/function/of)

```js
import { of } from 'rxjs'

// Unsubscribe after the 3 values emit
of(1, 2, 3).subscribe()
```

[`from()` operator](https://rxjs-dev.firebaseapp.com/api/index/function/from)

```js
import { from } from 'rxjs'

// Unsubscribe after the 3 values emit
from([ 1, 2, 3 ]).subscribe()
```

[`take()` operator](https://rxjs-dev.firebaseapp.com/api/operators/take)

```js
import { interval } from 'rxjs'
import { take } from 'rxjs/operators'

// Unsubscribe after emitting 5 items.
interval(1000).pipe(
  take(5)
).subscribe()
```

[`takeWhile()` operator](https://rxjs-dev.firebaseapp.com/api/operators/takeWhile)

```js
import { interval } from 'rxjs'
import { takeWhile } from 'rxjs/operators'

// Unsubscribe after the value of interval is more than 4.
interval(1000).pipe(
  takeWhile((i) => i < 5)
).subscribe()
```

[`takeUntil()` operator](https://rxjs-dev.firebaseapp.com/api/operators/takeUntil)

```js
import { interval } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// Unsubscribe after 5 seconds.
interval(1000).pipe(
  takeUntil(interval(5000))
).subscribe()
```

