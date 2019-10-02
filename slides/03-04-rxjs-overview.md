# RxJS Overview

```
Creation operator
  Function(args) → Observable

Pipeable operator
  Function(Observable) → Observable

Observable
│ .pipe(...Pipeable operators) → Observable
│ .subscribe(callback or Subject) → Subscription
│
└─ Subject
   │ .next(value) → void
   │
   ├─ BehaviorSubject(initialValue)
   │    .getValue() → any
   │    .value → any
   │
   ├─ ReplaySubject(bufferCount)
   │
   └─ AsyncSubject

Subscription
  .add(Subscription) → Subscription
  .unsubscribe() → void
```

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