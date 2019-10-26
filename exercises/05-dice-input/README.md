# Exercise 5: Dice Input

## Goals

1. Create the `<dice-input>` component in `./dice-input.js`.
2. Render 6 `<dice-input>` components. This is already set up in `./dice-picker.js`.

## API

### Dice Input

|Name|Type|Description|
|---|---|---|
|`faces`|Attribute, Property|Number (`4`, `6`, `8`, `10`, `12`, `20`)|
|`value`|Attribute, Property|Number|
|`reset()`|Method|Set `value` to `0`|
|`dice-input-changed`|Event (bubbles)|`{ faces, value }`|
|`click` → `decrement`|Event → Intent|Decrement `value`|
|`click` → `increment`|Event → Intent|Increment `value`|
|`<button is="dice-button">`|Child||

```html
<dice-input faces="6" value="3" />
```

## Dependencies

|Dependency|Path|
|---|---|
|[`combineLatest`](https://rxjs-dev.firebaseapp.com/api/index/function/combineLatest)|`rxjs`|
|[`merge`](https://rxjs-dev.firebaseapp.com/api/index/function/merge)|`rxjs`|
|[`map`](https://rxjs-dev.firebaseapp.com/api/operators/map)|`rxjs/operators`|
|[`mapTo`](https://rxjs-dev.firebaseapp.com/api/operators/mapTo)|`rxjs/operators`|
|[`tap`](https://rxjs-dev.firebaseapp.com/api/operators/tap)|`rxjs/operators`|
|[`withLatestFrom`](https://rxjs-dev.firebaseapp.com/api/operators/withLatestFrom)|`rxjs/operators`|
|`define`|`/lib/util/dom.js`|
|`html`|`/lib/util/dom.js`|
|`renderComponent`|`/lib/util/dom.js`|
|[`combineLatestObject`](../../lib/util/rx/README.md#combinelatestobject)|`/lib/util/rx.js`|
|[`fromEventSelector`](../../lib/util/rx/README.md#fromeventselector)|`/lib/util/rx.js`|
|[`fromMethod`](../../lib/util/rx/README.md#frommethod)|`/lib/util/rx.js`|
|[`fromProperty`](../../lib/util/rx/README.md#fromproperty)|`/lib/util/rx.js`|
|[`next`](../../lib/util/rx/README.md#next)|`/lib/util/rx.js`|
|[`useSubscribe`](../../lib/util/rx/README.md#usesubscribe)|`/lib/util/rx.js`|
