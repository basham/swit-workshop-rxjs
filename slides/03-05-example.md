# Example

```
Observables
  count$ (BehaviorSubject)
  countdown$

Operators
  interval
  map
  takeWhile
  withLatestFrom

Subscriptions
  updateCountSubscription
  renderSubscription
```

```js
import { BehaviorSubject, interval } from 'rxjs'
import { map, takeWhile, withLatestFrom } from 'rxjs/operators'
import { define, html, render } from '/lib/util/dom/lighterhtml.js'

define('countdown-rxjs', (el) => {
  const duration = 1000
  const count$ = new BehaviorSubject(20)

  const countdown$ = interval(duration).pipe(
    withLatestFrom(count$),
    map(([ , count ]) => count - 1),
    takeWhile((count) => count >= 0)
  )

  const updateCountSubscription = countdown$.subscribe(count$)

  const renderSubscription = count$.subscribe((count) => {
    renderComponent(el, count)
  })

  return () => {
    updateCountSubscription.unsubscribe()
    renderSubscription.unsubscribe()
  }
})

function renderComponent (el, count) {
  render(el, () => html`Countdown: ${count}`)
}
```
