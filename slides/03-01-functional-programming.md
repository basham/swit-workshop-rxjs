# Functional programming

- Use functions to perform operations on data structures
- Describes *what* to do, not *how* to do it
- Data tends to be immutable
- No (or few) side effects

```js
// Functional example
const total = [0, 1, 2, 3, 4, 5]
  // Get every other value.
  .filter((value, index) => index % 2 === 0)
  // Multiply it by 2.
  .map((value) => value * 2)
  // Add them all up.
  .reduce((acc, curr) => acc + curr, 0)
```

```js
// Non-functional example
const source = [0, 1, 2, 3, 4, 5]
let total = 0
for (let i = 0; i < source.length; i++) {
  if (i % 2 === 0) {
    total += source[i] * 2
  }
}
```
