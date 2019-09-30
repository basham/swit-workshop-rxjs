import { define, html, render } from '../src/util/dom/react.js'

// React
// render(what, where)
// https://reactjs.org/docs/rendering-elements.html
define('dice-root', (el) => {
  render(html`
    Root
  `, el)
})
