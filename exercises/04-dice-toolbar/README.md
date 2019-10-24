# Exercise 4

## Goals

1. Create `<dice-toolbar>`.
2. Display the roll total.
3. Add a button to roll all the dice at once.
4. Add a button to remove all the dice at once.
5. Hide the toolbar when there are no dice in the tray.

## APIs

### Toolbar

|Name|Type|Description|
|---|---|---|
|`count`|Property|Number of dice|
|`total`|Property|Total count of dice|
|`click` → `roll`|Event (bubbles) → Intent|Roll all dice|
|`click` → `reset`|Event (bubbles) → Intent|Remove all dice|

```html
<dice-toolbar count="3" total="22" />
```

### Root

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
