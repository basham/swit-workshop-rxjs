# Exercise 1

## Goals

1. Create the `<dice-root>` component as the container for other components.
2. Render 6 `<button is="dice-button" label="1" size="medium" theme="solid">` components. Each button should have a different `faces` attribute.

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
