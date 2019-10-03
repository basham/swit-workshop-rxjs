# Custom operators

Custom ["pipeable" operators](https://rxjs-dev.firebaseapp.com/guide/operators) behave just like native operators

```js
// Compose one operator
const simpleOperator = () => foo()
```

```js
// Compose multiple operators
import { pipe } from 'rxjs'

const complexOperator = () => pipe(
  simpleOperator(),
  bar()
)
```
