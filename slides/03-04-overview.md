# Overview

```
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

Static operator
  Function(args) → Observable

Pipeable operator
  Function(Observable) → Observable

Subscription
  .add(Subscription) → Subscription
  .unsubscribe() → void
```

See: https://rxjs-dev.firebaseapp.com/guide/overview
