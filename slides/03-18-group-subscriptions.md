# Group subscriptions

Group subscriptions with `.add()` to reduce `.unsubscribe()` calls

```js
import { interval } from 'rxjs'

const firstSubscription = interval(1000).subscribe()
const secondSubscription = interval(1500).subscribe()

setTimeout(() => {
  firstSubscription.unsubscribe()
  secondSubscription.unsubscribe()
}, 5000)
```

```js
import { interval } from 'rxjs'

const firstSubscription = interval(1000).subscribe()
const secondSubscription = interval(1500).subscribe()

// Unsubscribe a child subscription
// when the parent subscription unsubscribes
firstSubscription.add(secondSubscription)

setTimeout(() => {
  firstSubscription.unsubscribe()
}, 5000)
```
