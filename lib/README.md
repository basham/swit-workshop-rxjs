# Library files

## Components

The `/lib/components/` folder contains references to the finished components (located in the `/exercises/` folder). This is used as shortcut.

```js
import '/lib/components/dice-tray.js'
// <dice-tray> imported
```

This folder also contains the styles for each component. Import all component styles (including extra ones needed to help the workshop exercises) with the `/lib/styles.js` file.

```js
import '/lib/styles.js'
// Styles imported and applied to the DOM
```

## Constants

`FACES`: An array numbers representing the dice faces supported by this app.

```js
import { FACES } from '/lib/constants.js'
// [ 4, 6, 8, 10, 12, 20 ]
```

## Utilities

A set of Array, Dice, DOM, Math, RxJS, and *hook-like* Use functions.

See [`/lib/util/`](./util).
