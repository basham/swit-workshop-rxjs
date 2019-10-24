# Exercise 3

## Goals

1. Create the `<dice-tray>` component to render `<dice-die>` components based on a formula. The formula format should be `<number of dice>d<number of faces>` (e.g. `1d4`, `2d6 1d20`).
2. Emit a custom `tray-changed` event every time the dice roll. This event should summarize the results of the roll, the number of dice in the tray, and the sum total value of the dice in the tray.

## APIs

### Tray

|Name|Type|Description|
|---|---|---|
|`formula`|Attribute, Property|String (`'1d4'`, `'2d6 1d20'`)|
|`value-changed` → `tray-changed`|Event → Event (bubbles)|Summarize dice results, count, and total based on `<dice-button>` events|
|`<dice-button>`|Child||

```html
<dice-tray formula="2d6 1d20" />
```

### Root

|Name|Type|Description|
|---|---|---|
|`<dice-tray>`|Child||

```html
<dice-root />
```
