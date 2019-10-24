# Exercise 7

## Goals

1. Integrate `<dice-picker>` with `<dice-root>`.

## APIs

### Root

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
