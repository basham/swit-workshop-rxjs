import { define, html, render } from '../util/dom.js'
import { FACES } from '../constants.js'

define('dice-root', (el) => {
  render(el, () => renderComponent())
})

function renderComponent () {
  return html`
    ${renderSection({ size: 'small', theme: 'ghost' })}
    ${renderSection({ size: 'medium', theme: 'solid', label: '1' })}
  `
}

function renderSection (props) {
  return html`
    <div class='section'>
      ${FACES.map((faces) => renderButton({ ...props, faces }))}
    </div>
  `
}

function renderButton (props) {
  const { faces, label, size, theme } = props
  const type = `d${faces}`
  const ariaLabel = label ? `${label}, ${type}` : type
  return html`
    <button
      aria-label=${ariaLabel}
      faces=${faces}
      is='dice-button'
      label=${label}
      size=${size}
      theme=${theme}>
    </button>
  `
}
