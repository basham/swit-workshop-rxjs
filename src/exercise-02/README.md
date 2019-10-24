# Exercise 2

## Goals

1. Create the `<dice-die>` component as a logic wrapper around the `<button is="dice-button">`. Clicking on the button should roll the die and settle upon a random number.

## APIs

### Die

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

### Root

|Name|Type|Description|
|---|---|---|
|`<dice-die>`|Child||

```html
<dice-root />
```
