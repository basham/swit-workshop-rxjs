# Rx

RxJS utilities.

## `combineLatestObject`

Transform an object containing Observables into an Observable. This emits objects of the same keys but with values matching the latest value of each of its input Observables.

This is inspired by the [`combineLatest` operator](https://rxjs-dev.firebaseapp.com/api/index/function/combineLatest), but this is more useful for creating inputs for DOM rendering.

```
combineLatestObject(source: Object): Observable
```

```js
import { BehaviorSubject, interval } from 'rxjs'
import { combineLatestObject } from '/lib/util/rx.js'

const a$ = new BehaviorSubject(true)
const b$ = interval(1000)

combineLatestObject({
  a: a$,
  b: b$,
  c: 'string'
}).subscribe((props) => console.log(props))

setInterval(() => {
  a$.next(!a$.getValue())
}, 2000)

// { a: true, b: 0, c: 'string' }
// { a: true, b: 1, c: 'string' }
// { a: false, b: 1, c: 'string' }
// { a: false, b: 2, c: 'string' }
// { a: false, b: 3, c: 'string' }
// { a: true, b: 3, c: 'string' }
// ...
```

## `debug`

Display the current value in the console for every emission on the source Observable, but return an Observable that is identical to the source.

```
debug(message?: String, type?: ConsoleType = 'log')

ConsoleType: 'dir', 'error', 'log', 'table', 'warn'
```

```js
import { interval } from 'rxjs'
import { debug } from '/lib/util/rx.js'

interval(1000).pipe(
  debug('interval')
).subscribe()

// interval
//   0
// interval
//   1
// interval
//   2
// ...
```

## `distinctUntilObjectChanged`

Similar to the [`distinctUntilChanged` operator](https://rxjs-dev.firebaseapp.com/api/operators/distinctUntilChanged), but it will compare objects rather than just simple types.

```
distinctUntilObjectChanged(): Observable
```

```js
import { distinctUntilObjectChanged } from '/lib/util/rx.js'
```

## `fromEventSelector`

Similar to the [`fromEvent` operator](https://rxjs-dev.firebaseapp.com/api/index/function/fromEvent), but instead of emitting events from a given target, it emits events from any elements matching the selector within the scope of the given target.

This makes it easier to listen to events from dynamic DOM elements. It also removes the need to attach handlers directly to elements (`<button onclick=${handleClick}>`). Separating handlers from the template makes the code more testable.

```
fromEventSelector(target: HTMLElement, selector: String, eventName: String, options?: EventListenerOptions): Observable
```

```html
<button class='visible' value="1">Option 1</button>
<button class='visible' value="2">Option 2</button>
<button class='hidden' value="3">Option 3</button>
```

```js
import { map } from 'rxjs/operators'
import { fromEventSelector } from '/lib/util/rx.js'

// After 2 seconds, the hidden button becomes visible.
// It can now be clicked on and its events emit in the Observable.

fromEventSelector(document, 'button.visible', 'click').pipe(
  map(({ target }) => target.value)
).subscribe((v) => console.log('Button value', v))

setTimeout(() => {
  document.querySelectorAll('button.hidden').forEach((el) => {
    el.classList.remove('hidden')
    el.classList.add('visible')
  })
}, 2000)
```

## `fromMethod`

Attach a method to an element.

```
fromMethod(target: HTMLElement, name: String): Subject
```

```html
<output id='output'></output>
```

```js
import { scan } from 'rxjs/operators'
import { fromMethod } from '/lib/util/rx.js'

const el = document.getElementById('output')

fromMethod(el, 'add').pipe(
  scan((acc, value) => (acc + value), 0)
).subscribe((total) => {
  el.innerHTML = total
  console.log('Total', total)
})

el.add(1)
// 1

el.add(2)
// 3

el.add(3)
// 6
```