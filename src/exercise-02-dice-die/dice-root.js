import { define, html, render } from '../util/dom.js'
import { FACES } from '../constants.js'

define('dice-root', (el) => {
  render(el, renderComponent)
})

function renderComponent () {
  return html`
    ${FACES.map((faces) => renderButton({ faces }))}
  `
}

function renderButton (props) {
  const { faces } = props
  return html`
    <button
      faces=${faces}
      is='dice-button'
      label='1'
      size='medium'
      theme='solid'>
    </button>
  `
}
