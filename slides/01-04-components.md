# Components

```
Root <dice-root>
├─ Picker <dice-picker>
│  └─ Input <dice-input> (×6)
│     ├─ Add die button <dice-button>
│     └─ Remove die button <button>
├─ Toolbar <dice-toolbar>
│  ├─ Total <div>
│  ├─ Roll <button>
│  └─ Remove all <button>
└─ Tray <dice-tray>
   └─ Die <dice-die> (×N)
      └─ Button <dice-button>
```

## 1. Button

|Name|Type|Description|
|---|---|---|
|`faces`|Attribute, Property|Number (`4`, `6`, `8`, `10`, `12`, `20`)|
|`label`|Attribute, Property|String|
|`click`|Event (bubbles)||

```html
<dice-button faces="6" label="3" />
```

## 2. Input

|Name|Type|Description|
|---|---|---|
|`faces`|Attribute, Property|Number (`4`, `6`, `8`, `10`, `12`, `20`)|
|`value`|Attribute, Property|Number|
|`reset()`|Method|Set `value` to `0`|
|`dice-input-changed`|Event (bubbles)|`{ faces, value }`|
|`click` → `decrement`|Event → Intent|Decrement `value`|
|`click` → `increment`|Event → Intent|Increment `value`|
|`<dice-button>`|Child||

```html
<dice-input faces="6" value="3" />
```

## 3. Picker

|Name|Type|Description|
|---|---|---|
|`formula`|Property|String (`'1d4'`, `'2d6 1d20'`)|
|`dice-input-changed` → `formula`|Event → Property|Update `formula` based on `<dice-input>` changes|
|`reset()`|Method|Set `value` of `<dice-input>` children to `0`|
|`<dice-input>`|Child|One input for each dice type (d4, d6, d8, d10, d20)|

```html
<dice-picker />
```

## 4. Toolbar

|Name|Type|Description|
|---|---|---|
|`count`|Property|Number of dice|
|`total`|Property|Total count of dice|
|`click` → `roll`|Event (bubbles) → Intent|Roll all dice|
|`click` → `reset`|Event (bubbles) → Intent|Remove all dice|

```html
<dice-toolbar count="3" total="22" />
```

## 5. Die

|Name|Type|Description|
|---|---|---|
|`faces`|Attribute, Property|Number (`4`, `6`, `8`, `10`, `12`, `20`)|
|`value`|Attribute, Property|Number|
|`roll()`|Method|Roll a new `value`|
|`click` → `roll`|Event → Intent|Roll a new `value`|
|`<dice-button>`|Child||

```html
<dice-die faces="6" value="3" />
```

## 6. Tray

|Name|Type|Description|
|---|---|---|
|`formula`|Attribute, Property|String (`'1d4'`, `'2d6 1d20'`)|
|`value-changed` → `tray-changed`|Event → Event (bubbles)|Summarize dice results, count, and total based on `<dice-button>` events|
|`<dice-button>`|Child||

```html
<dice-tray formula="2d6 1d20" />
```

## 7. Root

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
<dice-tray formula="2d6 1d20" />
```
