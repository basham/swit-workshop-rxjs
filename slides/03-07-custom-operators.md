# Custom operators

Custom ["pipeable" operators](https://rxjs-dev.firebaseapp.com/guide/v6/pipeable-operators) behave just like native operators

```js
// Compose one operator
const simpleOperator = () => foo()

// Compose multiple operators
const complexOperator = () => (source$) => source$.pipe(
  simpleOperator(),
  bar()
)
```
