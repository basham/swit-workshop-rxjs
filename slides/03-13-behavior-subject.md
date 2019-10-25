# BehaviorSubject

1+ values

Track values

```js
import { BehaviorSubject } from 'rxjs'
import { debug } from '/lib/util/rx/debug.js'

const ON = true
const OFF = false
const lightswitch$ = new BehaviorSubject(OFF)

function toggle () {
  const value = lightswitch$.getValue() === ON ? OFF : ON
  lightswitch$.next(value)
}

lightswitch$.pipe(
  debug('Lightswitch log')
).subscribe()

toggle()
toggle()

// Lightswitch log
//   false (initial value)
//   true
//   false
```

```js
import { BehaviorSubject, Subject } from 'rxjs'
import { map, withLatestFrom } from 'rxjs/operators'
import { debug } from '/lib/util/rx/debug.js'

const ON = true
const OFF = false

// Toggle events could be defined as a Subject.
const toggle$ = new Subject()
const lightswitch$ = new BehaviorSubject(OFF)

const lightswitchToggle$ = toggle$.pipe(
  // Extract the latest value from 1+ Observables.
  // Returns an array.
  withLatestFrom(lightswitch$),
  map(([ toggle, lightswitch ]) => lightswitch),
  map((value) => value === ON ? OFF : ON),
  debug('Toggle log')
)

// Like a Subject, new values can be pushed directly to a
// BehaviorSubject via `.subscribe(behaviorSubject$)`.
lightswitchToggle$.subscribe(lightswitch$)

function toggle () {
  toggle$.next(null)
}

toggle()
toggle()

// Toggle log
//   true
//   false
```
