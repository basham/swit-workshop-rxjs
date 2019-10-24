import { define, html, render } from '../util/dom.js'

define('dice-root', (el) => {
  render(el, renderComponent)
})

function renderComponent () {
  return html`
    <dice-tray formula='1d4 1d6 1d8 1d10 1d12 1d20' />
  `
}
