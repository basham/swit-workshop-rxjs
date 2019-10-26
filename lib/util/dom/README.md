# DOM

DOM utilities.

## `define`

Define a custom element. This is a wrapper around [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define). It removes the need to explicitly use classes, so it feels more functional. It uses [`when-elements`](https://github.com/indiana-university/when-elements) as a fallback if the browser doesn't support classes, built-in elements, or custom elements.

```
define(name: String, extendsElement?: String, callback: Function): void

callback(target: HTMLElement): void
```

```html
<custom-element></custom-element>
```

```js
import { define } from '/lib/util/dom.js'

define('custom-element', (element) => {
  // Initiate
})
```

```html
<button is="custom-button"></button>
```

```js
import { define } from '/lib/util/dom.js'

define('custom-button', 'button', (element) => {
  // Initiate
})
```

## `html`

Use the function tag to create markup for the given rendering library.

`/lib/util/dom.js` is a shortcut for `/lib/util/lighterhtml.js`.

```js
import { html } from '/lib/util/dom/lighterhtml.js'

const markup = html`<p>Lighterhtml markup</p>`
```

```js
import { html } from '/lib/util/dom/react.js'

const markup = html`<p>React markup</p>`
```

## `keychain`

Use this only if using [lighterhtml](https://github.com/WebReflection/lighterhtml) (by importing via `/lib/util/dom.js` or `/lib/util/dom/lighterhtml.js`).

When rendering lists of elements, rendering engines need to keep track of which elements get moved or inserted at any given index. Without providing some way to "key" elements, elements may be unnecessarily destroyed or reconfigured to look like sibling elements. [React uses a `key` prop](https://reactjs.org/docs/lists-and-keys.html) with a string value to key elements. Rather than using props on a single element, lighterhtml uses `html.for(refObject)` to key any string of markup. Keychain maps a string to a unique object (`refObject`), to simplify the keying process.

```
keychain(): getKey

getKey(key: String): Object
```

```html
<div id="root"></div>
```

```js
import { interval } from 'rxjs'
import { map, scan, startWith } from 'rxjs/operators'
import { html, keychain, renderComponent } from '/lib/util/dom/lighterhtml.js'
import { random } from '/lib/util/math.js'

const el = document.getElementById('root')
const getKey = keychain()

// Every second, add or remove a random number from the list.
// Only one element within the keyed list will
// ever be added or removed in any given DOM change.
// In contrast, the non-keyed list could result in much
// more DOM changes.
interval(1000).pipe(
  map(() => random(0, 10)),
  scan((set, value) => {
    if (set.has(value)) {
      set.delete(value)
    } else {
      set.add(value)
    }
    return set
  }, new Set()),
  map((set) =>
    Array.from(set)
      .sort()
      .map((value) => {
        const key = getKey(`key-${value}`)
        return { key, value }
      })
  ),
  startWith([]),
  map((list) => ({ list })),
  renderComponent(el, renderLists)
).subscribe()

function renderLists (props) {
  const { list } = props
  return html`
    <h2>Keyed list</h2>
    <ul>${list.map(renderKeyedItem)}</ul>
    <h2>Non-keyed list</h2>
    <ul>${list.map(renderNonKeyedItem)}</ul>
  `
}

function renderKeyedItem (props) {
  const { key, value } = props
  return html.for(key)`<li>${value}</li>`
}

function renderNonKeyedItem (props) {
  const { key, value } = props
  return html`<li>${value}</li>`
}
```

## `renderComponent`

Use this pipeable operator to render to an element. The incoming value is passed to the rendering function. Like the `tap()` operator, it returns an Observable that is identical to the source.

```
renderComponent(target: HTMLElement, callback: Function): Observable

callback(value: any): void
```

```html
<div id="root"></div>
```

```js
import { interval } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { html, renderComponent } from '/lib/util/dom.js'

const el = document.getElementById('root')

interval(1000).pipe(
  startWith(0),
  map((value) => ({ label: 'Tick', value })),
  renderComponent(el, render)
).subscribe()

function render (props) {
  const { label, value } = props
  return html`<p>${label}: ${value}</p>`
}
```
