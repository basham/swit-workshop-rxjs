# Subscription

```js
import { interval } from 'rxjs'

// Never unsubscribe.
interval(1000).subscribe()
```

## Unsubscribe explicitly

```js
import { interval } from 'rxjs'

// Unsubscribe after 5 seconds.
const subscription = interval(1000).subscribe()
setTimeout(() => {
  subscription.unsubscribe()
}, 5000)
```

```js
import { interval } from 'rxjs'

// Unsubscribe a child subscription
// when the parent subscription unsubscribes.
const subscription = interval(1000).subscribe()
const childSubscription = interval(1500).subscribe()
subscription.add(childSubscription)

setTimeout(() => {
  subscription.unsubscribe()
}, 5000)
```

```js
import { interval } from 'rxjs'
import { filter } from 'rxjs/operators'
import { define } from '../src/util/dom/define.js'

// Remove the element after the interval emits 5 times.
// Removing the element unsubscribes the interval
// via the returned callback.
define('timer-component', (el) => {
  const subscription = interval(1000).pipe(
    filter((i) => i > 5)
  ).subscribe(() => el.remove())
  return () => subscription.unsubscribe()
})
```

## Unsubscribe with operators

```js
import { interval } from 'rxjs'
import { take } from 'rxjs/operators'

// Unsubscribe after emitting 5 items.
interval(1000).pipe(
  take(5)
).subscribe()
```

```js
import { interval } from 'rxjs'
import { takeWhile } from 'rxjs/operators'

// Unsubscribe after the value of interval is more than 4.
interval(1000).pipe(
  takeWhile((i) => i < 5)
).subscribe()
```

```js
import { interval } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// Unsubscribe after 5 seconds.
interval(1000).pipe(
  takeUntil(interval(5000))
).subscribe()
```
