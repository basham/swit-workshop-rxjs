import { define, html, render } from '../src/util/dom/lighterhtml.js'

// lighterhtml
// render(where, () => what)
// https://github.com/WebReflection/lighterhtml
define('dice-root', (el) => {
  render(el, () => html`
    Root
  `)
})
