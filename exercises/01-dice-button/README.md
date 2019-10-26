# Exercise 1

## Goals

1. Render 6 `<button is="dice-button" label="1" size="medium" theme="solid">` components. Each button should have a different `faces` attribute.

## APIs

### Button

|Name|Type|Description|
|---|---|---|
|`faces`|Attribute, Property|Number (`4`, `6`, `8`, `10`, `12`, `20`)|
|`label`|Attribute, Property|String|
|`size`|Attribute|String (`small`, `medium`), used for styling|
|`theme`|Attribute|String (`ghost`, `solid`), used for styling|

```html
<button is="dice-button" faces="6" label="3" size="medium" theme="solid" />
```

### Root

|Name|Type|Description|
|---|---|---|
|`<button is="dice-button">`|Child||

```html
<dice-root />
```

## Dependencies

|Dependency|Path|
|---|---|
|`define`|`/lib/util/dom.js`|
|`html`|`/lib/util/dom.js`|
|`renderComponent`|`/lib/util/dom.js`|
|[`combineLatestObject`](../../lib/util/rx/README.md#combinelatestobject)|`/lib/util/rx.js`|
|[`fromProperty`](../../lib/util/rx/README.md#fromproperty)|`/lib/util/rx.js`|
|[`useSubscribe`](../../lib/util/rx/README.md#usesubscribe)|`/lib/util/rx.js`|
