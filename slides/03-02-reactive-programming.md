# Reactive programming

- Observables emit data

- Subscribers listen to emitted data

- Everything is asynchronous

- Observables do more than Promises

- Code reads more naturally: top → down

```js
// Whenever a$ or b$ emits, c$ emits.
const c$ = combineLatest(a$, b$).pipe(
  map(([ a, b ]) => a + b)
)
```

```js
// Without streams, values need to know which other values depend on it.
let a = null
let b = null
let c = null

function setA (value) {
  a = value
  updateC()
}

function setB (value) {
  b = value
  updateC()
}

function updateC () {
  c = a + b
}
```
