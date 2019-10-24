# Exercise 5

## Goals

1. Create the `<dice-input>` component.

## APIs

### Input

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
