# Exercise 2: Dice Die

## Goals

1. Create the `<dice-die>` component in `./dice-die.js`.
2. It should be a logic wrapper around the `<button is="dice-button">`. Clicking on the button should roll the die and settle upon a random number.

## API

|Name|Type|Description|
|---|---|---|
|`faces`|Attribute, Property|Number (`4`, `6`, `8`, `10`, `12`, `20`)|
|`value`|Attribute, Property|Number|
|`roll()`|Method|Roll a new `value`|
|`click` → `roll`|Event → Intent|Roll a new `value`|
|`<button is="dice-button">`|Child||

```html
<dice-die faces="6" value="3" />
```

## Dependencies

|Dependency|Path|
|---|---|
|[`merge`](https://rxjs-dev.firebaseapp.com/api/index/function/merge)|`rxjs`|
|[`range`](https://rxjs-dev.firebaseapp.com/api/index/function/range)|`rxjs`|
|[`timer`](https://rxjs-dev.firebaseapp.com/api/index/function/timer)|`rxjs`|
|[`concatMap`](https://rxjs-dev.firebaseapp.com/api/operators/concatMap)|`rxjs/operators`|
|[`map`](https://rxjs-dev.firebaseapp.com/api/operators/map)|`rxjs/operators`|
|[`scan`](https://rxjs-dev.firebaseapp.com/api/operators/scan)|`rxjs/operators`|
|[`startWith`](https://rxjs-dev.firebaseapp.com/api/operators/startWith)|`rxjs/operators`|
|[`switchMap`](https://rxjs-dev.firebaseapp.com/api/operators/switchMap)|`rxjs/operators`|
|[`withLatestFrom`](https://rxjs-dev.firebaseapp.com/api/operators/withLatestFrom)|`rxjs/operators`|
|[`randomItem`](../../lib/util/README.md#randomitem)|`/lib/util/array.js`|
|[`range`](../../lib/util/README.md#range)|`/lib/util/array.js`|
|`define`|`/lib/util/dom.js`|
|`html`|`/lib/util/dom.js`|
|`renderComponent`|`/lib/util/dom.js`|
|[`random`](../../lib/util/README.md#random)|`/lib/util/math.js`|
|[`combineLatestObject`](../../lib/util/rx/README.md#combinelatestobject)|`/lib/util/rx.js`|
|[`fromEventSelector`](../../lib/util/rx/README.md#fromeventselector)|`/lib/util/rx.js`|
|[`fromMethod`](../../lib/util/rx/README.md#frommethod)|`/lib/util/rx.js`|
|[`fromProperty`](../../lib/util/rx/README.md#fromproperty)|`/lib/util/rx.js`|
|[`next`](../../lib/util/rx/README.md#next)|`/lib/util/rx.js`|
|[`useSubscribe`](../../lib/util/rx/README.md#usesubscribe)|`/lib/util/rx.js`|
