# Exercise 6: Dice Picker

## Goals

1. Create the `<dice-picker>` component in `./dice-picker.js`.

## API

### Dice Picker

|Name|Type|Description|
|---|---|---|
|`formula`|Property|String (`'1d4'`, `'2d6 1d20'`)|
|`dice-input-changed` → `formula`|Event → Property|Update `formula` based on `<dice-input>` changes|
|`reset()`|Method|Set `value` of `<dice-input>` children to `0`|
|`<dice-input>`|Child|One input for each dice type (`d4`, `d6`, `d8`, `d10`, `d20`)|

```html
<dice-picker />
```

## Dependencies

|Dependency|Path|
|---|---|
|[`fromEvent`](https://rxjs-dev.firebaseapp.com/api/index/function/fromEvent)|`rxjs`|
|[`merge`](https://rxjs-dev.firebaseapp.com/api/index/function/merge)|`rxjs`|
|[`distinctUntilChanged`](https://rxjs-dev.firebaseapp.com/api/operators/distinctUntilChanged)|`rxjs/operators`|
|[`map`](https://rxjs-dev.firebaseapp.com/api/operators/map)|`rxjs/operators`|
|[`scan`](https://rxjs-dev.firebaseapp.com/api/operators/scan)|`rxjs/operators`|
|[`tap`](https://rxjs-dev.firebaseapp.com/api/operators/tap)|`rxjs/operators`|
|[`decodeFormula`](../../lib/util/README.md#decodeformula)|`/lib/util/dice.js`|
|[`encodeFormula`](../../lib/util/README.md#encodeformula)|`/lib/util/dice.js`|
|`define`|`/lib/util/dom.js`|
|`html`|`/lib/util/dom.js`|
|`renderComponent`|`/lib/util/dom.js`|
|[`combineLatestObject`](../../lib/util/rx/README.md#combinelatestobject)|`/lib/util/rx.js`|
|[`fromMethod`](../../lib/util/rx/README.md#frommethod)|`/lib/util/rx.js`|
|[`fromProperty`](../../lib/util/rx/README.md#fromproperty)|`/lib/util/rx.js`|
|[`next`](../../lib/util/rx/README.md#next)|`/lib/util/rx.js`|
|[`useSubscribe`](../../lib/util/rx/README.md#usesubscribe)|`/lib/util/rx.js`|
