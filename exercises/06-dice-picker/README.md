# Exercise 6

## Goals

1. Create the `<dice-picker>` component.

## APIs

### Picker

|Name|Type|Description|
|---|---|---|
|`formula`|Property|String (`'1d4'`, `'2d6 1d20'`)|
|`dice-input-changed` → `formula`|Event → Property|Update `formula` based on `<dice-input>` changes|
|`reset()`|Method|Set `value` of `<dice-input>` children to `0`|
|`<dice-input>`|Child|One input for each dice type (d4, d6, d8, d10, d20)|

```html
<dice-picker />
```
