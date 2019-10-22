# Subscription

Nothing happens within an observable unless it is subscribed to

Calling `.subscribe()` returns a Subscription

```js
import { interval } from 'rxjs'

// Observable created but never does any work
const i$ = interval(1000)
```

```js
import { interval } from 'rxjs'

// Observable emits a value every second
const i$ = interval(1000)
const subscription = i$.subscribe()
```

Subscribe with an [Observer object](https://rxjs-dev.firebaseapp.com/api/index/interface/Observer)

```js
import { interval } from 'rxjs'

const i$ = interval(1000)
const subscription = i$.subscribe({
  next: (value) => {
    // Called for each emitted value
  },
  error: (err) => {
    // Called if an emitted error is not caught.
    // This will never happen in this particular case.
  },
  complete: () => {
    // Called if the observable "completes",
    // indicating there will be no more emitted values.
    // This will never happen in this particular case.
  }
})
```

Subscribe with callbacks

```js
import { interval } from 'rxjs'

const i$ = interval(1000)
const subscription = i$.subscribe(
  // Next callback
  (value) => { /* ... */ },
  // Not providing an Error callback
  undefined,
  // Complete callback
  () => { /* ... */ }
)
```

```js
import { interval } from 'rxjs'

const i$ = interval(1000)
// Subscribe with Next callback
const subscription = i$.subscribe((value) => { /* ... */ })
```

Subscribe with a Subject (or BehaviorSubject)

```js
import { interval } from 'rxjs'

const value$ = new BehaviorSubject(0)
const i$ = interval(1000)
// Push emitted values from i$ on to value$
const subscription = i$.subscribe(value$)
```
