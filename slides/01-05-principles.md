# Principles

## 1. DOM is the interface

Attributes, properties, and methods push data down

Events bubble data up

Use JSON-friendly data types (strings, numbers, booleans, objects, arrays)

```
<thing attribute="value">
thing.property = value
thing.method(options)

document.addEventListener('event', callback)
```

## 2. Reduce and isolate side effects

Don't mutate data (prefer `const` over `let`)

Write pure functions (same output for same input)

More testable code

```
fn(a, b) === fn(a, b)
```

## 3. React, don't command

Self-determine how and when to respond (reactive)

Don't let things determine how and when other things respond (imperative)

```
Imperative      vs     Reactive

┌─────────┐            ┌─────────┐
│    A    │            │    A    │
└─┃─────┃─┘            └─────────┘
  ▼     ▼
                         ┃     ┃
┌───┐ ┌───┐            ┌ ▼ ┐ ┌ ▼ ┐
│ B │ │ C │            │ B │ │ C │
└───┘ └───┘            └───┘ └───┘

[A] commands           [B] and [C] respond
```
