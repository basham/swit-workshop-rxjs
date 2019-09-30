# Template literals

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

```js
const a = 'This string with an ' + expression + '.'

function tag (string) {
  // return some change to the string
}

const b = tag(a)
```

```js
const a = `This string with an ${expression}.`

const b = tag`This string with an ${expression} will be processed through the tag function.`
```
