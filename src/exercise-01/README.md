# Exercise 1

## Goals

1. Create `<dice-root>` component as the container for other components.
2. Render 1 row of 6 `<button is="dice-button" theme="ghost">` components. Each button should have a different `faces` attribute.
3. Render 1 row of 6 `<button is="dice-button" theme="solid" label="1">` components. Each button should have a different `faces` attribute.

## APIs

### Button

|Name|Type|Description|
|---|---|---|
|`faces`|Attribute, Property|Number (`4`, `6`, `8`, `10`, `12`, `20`)|
|`label`|Attribute, Property|String|

```html
<button is="dice-button" faces="6" label="3" />
```

### Root

|Name|Type|Description|
|---|---|---|
|`<button is="dice-button">`|Child||

```html
<dice-root />
```
