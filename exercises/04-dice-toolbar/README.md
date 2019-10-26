# Exercise 4: Dice Toolbar

## Goals

1. Create the `<dice-toolbar>` component in `./dice-toolbar.js`.
2. Display the roll total.
3. Add a button to roll all the dice at once.
4. Add a button to remove all the dice at once.
5. Hide the toolbar when there are no dice in the tray.
6. Update `<dice-root>` to support `<dice-toolbar>`.

## API

### Dice Toolbar

|Name|Type|Description|
|---|---|---|
|`count`|Property|Number of dice|
|`total`|Property|Total count of dice|
|`click` → `roll`|Event (bubbles) → Intent|Roll all dice|
|`click` → `reset`|Event (bubbles) → Intent|Remove all dice|

```html
<dice-toolbar count="3" total="22" />
```

### Dice Root

|Name|Type|Description|
|---|---|---|
|`tray-changed` → `count`|Event → Attribute|Forward `count` from `<dice-tray>` to `<dice-toolbar>`|
|`tray-changed` → `total`|Event → Attribute|Forward `total` from `<dice-tray>` to `<dice-toolbar>`|
|`click` (Roll) → `roll()`|Event → Method|Call `<dice-tray>`'s `roll()` method based on `<dice-toolbar>`'s `click` event|
|`click` (Remove all) → `formula`|Event → Attribute|Reset the `formula` to `''`|
|`<dice-toolbar>`|Child||
|`<dice-tray>`|Child||

```html
<dice-root />
```

## Dependencies

|Dependency|Path|
|---|---|
|[`BehaviorSubject`](https://rxjs-dev.firebaseapp.com/api/index/class/BehaviorSubject)|`rxjs`|
|[`distinctUntilChanged`](https://rxjs-dev.firebaseapp.com/api/operators/distinctUntilChanged)|`rxjs/operators`|
|[`map`](https://rxjs-dev.firebaseapp.com/api/operators/map)|`rxjs/operators`|
|[`mapTo`](https://rxjs-dev.firebaseapp.com/api/operators/mapTo)|`rxjs/operators`|
|[`shareReplay`](https://rxjs-dev.firebaseapp.com/api/operators/shareReplay)|`rxjs/operators`|
|[`startWith`](https://rxjs-dev.firebaseapp.com/api/operators/startWith)|`rxjs/operators`|
|[`tap`](https://rxjs-dev.firebaseapp.com/api/operators/tap)|`rxjs/operators`|
|[`define`](../../lib/util/dom/README.md#define)|`/lib/util/dom.js`|
|[`html`](../../lib/util/dom/README.md#html)|`/lib/util/dom.js`|
|[`renderComponent`](../../lib/util/dom/README.md#rendercomponent)|`/lib/util/dom.js`|
|[`combineLatestObject`](../../lib/util/rx/README.md#combinelatestobject)|`/lib/util/rx.js`|
|[`fromEventSelector`](../../lib/util/rx/README.md#fromeventselector)|`/lib/util/rx.js`|
|[`fromProperty`](../../lib/util/rx/README.md#fromproperty)|`/lib/util/rx.js`|
|[`next`](../../lib/util/rx/README.md#next)|`/lib/util/rx.js`|
|[`useSubscribe`](../../lib/util/rx/README.md#usesubscribe)|`/lib/util/rx.js`|
