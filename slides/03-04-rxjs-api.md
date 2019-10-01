# RxJS API

## Subjects

```js
import {
  AsyncSubject,
  BehaviorSubject,
  ReplaySubject,
  Subject
} from 'rxjs'
```

```js
import { Subject } from 'rxjs'

const subject$ = new Subject()

// Emit a value
subject$.next(value)

// Listen to values
subject$.subscribe(callback)
```