# HTML from template literals

## React

Use [`htm`](https://github.com/developit/htm) template tag instead of JSX compiling.

```js
import { html } from 'htm/react' // 0.7kb (v2.2.1) *
import 'react' // 2.6kb (v16.10.1) *
import { render } from 'react-dom' // 36.4kb (v16.10.1) *

const htmlString = `<h1>Heading</h1><p>Content</p>`
const what = html`${htmlString}`
const where = document.getElementById('root')

render(what, where)
```

## lighterhtml

Use [`lighterhtml`](https://github.com/WebReflection/lighterhtml) to avoid overhead of virtual DOM.

```js
import { html, render } from 'lighterhtml' // 6.5kb (v1.2.1) *

const htmlString = `<h1>Heading</h1><p>Content</p>`
const what = html`${htmlString}`
const where = document.getElementById('root')

// Replace all.
render(where, what)

// Selectively replace with DOM diffing.
render(where, () => what)
```

`*` Bundle sizes (minified + gzipped) via [BundlePhobia](https://bundlephobia.com/)
