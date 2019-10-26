# Exercise 3: Dice Tray

## Goals

1. Create the `<dice-tray>` component in `./dice-tray.js`.
2. It should render `<dice-die>` components based on a formula. The formula format should be `<number of dice>d<number of faces>` (e.g. `1d4`, `2d6 1d20`).
3. Emit a custom `tray-changed` event every time the dice roll. This event should summarize the results of the roll, the number of dice in the tray, and the sum total value of the dice in the tray.

## API

### Dice Tray

|Name|Type|Description|
|---|---|---|
|`formula`|Attribute, Property|String (`'1d4'`, `'2d6 1d20'`)|
|`value-changed` → `tray-changed`|Event → Event (bubbles)|Summarize dice results, count, and total based on `<dice-button>` events|
|`<dice-button>`|Child||

```html
<dice-tray formula="2d6 1d20" />
```

## Dependencies

|Dependency|Path|
|---|---|
|[`Subject`](https://rxjs-dev.firebaseapp.com/api/index/class/Subject)|`rxjs`|
|[`merge`](https://rxjs-dev.firebaseapp.com/api/index/function/merge)|`rxjs`|
|[`map`](https://rxjs-dev.firebaseapp.com/api/operators/map)|`rxjs/operators`|
|[`shareReplay`](https://rxjs-dev.firebaseapp.com/api/operators/shareReplay)|`rxjs/operators`|
|[`tap`](https://rxjs-dev.firebaseapp.com/api/operators/tap)|`rxjs/operators`|
|[`range`](../../lib/util/README.md#range)|`/lib/util/array.js`|
|[`decodeFormula`](../../lib/util/README.md#decodeformula)|`/lib/util/dice.js`|
|`define`|`/lib/util/dom.js`|
|`html`|`/lib/util/dom.js`|
|`keychain`|`/lib/util/dom.js`|
|`renderComponent`|`/lib/util/dom.js`|
|[`combineLatestObject`](../../lib/util/rx/README.md#combinelatestobject)|`/lib/util/rx.js`|
|[`fromEventSelector`](../../lib/util/rx/README.md#fromeventselector)|`/lib/util/rx.js`|
|[`fromMethod`](../../lib/util/rx/README.md#frommethod)|`/lib/util/rx.js`|
|[`fromProperty`](../../lib/util/rx/README.md#fromproperty)|`/lib/util/rx.js`|
|[`next`](../../lib/util/rx/README.md#next)|`/lib/util/rx.js`|
|[`useSubscribe`](../../lib/util/rx/README.md#usesubscribe)|`/lib/util/rx.js`|
