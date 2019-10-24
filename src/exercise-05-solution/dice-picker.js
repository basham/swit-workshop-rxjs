import { define, html, render } from '../util/dom.js'
import { FACES } from '../constants.js'

define('dice-picker', (el) => {
  render(el, renderComponent)
})

function renderComponent () {
  return html`
    ${FACES.map((faces) => renderControl({ faces }))}
  `
}

function renderControl (props) {
  const { faces } = props
  return html`
    <dice-input faces=${faces} />
  `
}
