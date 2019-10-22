# Manually unsubscribe

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
