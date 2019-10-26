# Exercise 7: Dice Root

## Goals

1. Integrate `<dice-picker>` with `<dice-root>` in `./dice-root.js`.

## API

### Dice Root

|Name|Type|Description|
|---|---|---|
|`formula-changed` → `formula`|Event → Attribute|Forward `formula` from `<dice-picker>` to `<dice-tray>`|
|`tray-changed` → `count`|Event → Attribute|Forward `count` from `<dice-tray>` to `<dice-toolbar>`|
|`tray-changed` → `total`|Event → Attribute|Forward `total` from `<dice-tray>` to `<dice-toolbar>`|
|`click` → `roll()`|Event → Method|Call `<dice-tray>`'s `roll()` method based on `<dice-toolbar>`'s `click` event|
|`click` → `reset()`|Event → Method|Call `<dice-tray>`'s `reset()` method based on `<dice-toolbar>`'s `click` event|
|`<dice-picker>`|Child||
|`<dice-toolbar>`|Child||
|`<dice-tray>`|Child||

```html
<dice-root />
```

## Dependencies

|Dependency|Path|
|---|---|
|[`distinctUntilChanged`](https://rxjs-dev.firebaseapp.com/api/operators/distinctUntilChanged)|`rxjs/operators`|
|[`map`](https://rxjs-dev.firebaseapp.com/api/operators/map)|`rxjs/operators`|
|[`shareReplay`](https://rxjs-dev.firebaseapp.com/api/operators/shareReplay)|`rxjs/operators`|
|[`startWith`](https://rxjs-dev.firebaseapp.com/api/operators/startWith)|`rxjs/operators`|
|[`tap`](https://rxjs-dev.firebaseapp.com/api/operators/tap)|`rxjs/operators`|
|[`define`](../../lib/util/dom/README.md#define)|`/lib/util/dom.js`|
|[`html`](../../lib/util/dom/README.md#html)|`/lib/util/dom.js`|
|[`renderComponent`](../../lib/util/dom/README.md#rendercomponent)|`/lib/util/dom.js`|
|[`combineLatestObject`](../../lib/util/rx/README.md#combinelatestobject)|`/lib/util/rx.js`|
|[`fromEventSelector`](../../lib/util/rx/README.md#fromeventselector)|`/lib/util/rx.js`|
|[`useSubscribe`](../../lib/util/rx/README.md#usesubscribe)|`/lib/util/rx.js`|
