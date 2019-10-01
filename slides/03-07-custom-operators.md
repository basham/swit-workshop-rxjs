# Custom operators

Custom operators behave just like native operators

```js
function operator () {
  return function (source$) {
    return source$.pipe(
      // Compose other operators to do operation
    )
  }
}
```
