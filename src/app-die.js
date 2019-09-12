import { html } from 'lighterhtml'
import { whenAdded } from 'when-elements'
import { combineLatestProps, renderComponent } from './util.js'
import css from './app-die.css'

document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, css ]

whenAdded('app-die', (el) => {
  const description = el.getAttribute('description')
  const label = el.getAttribute('label')
  const sides = parseInt(el.getAttribute('sides') || 6)
  const { click = (() => {}) } = el

  const renderSub = combineLatestProps({
    description,
    click,
    label,
    sides
  }).pipe(
    renderComponent(el, render)
  ).subscribe()

  return () => {
    renderSub.unsubscribe()
  }

  function render (props) {
    const { click, description, label, sides } = props
    const type = `d${sides}`
    const icon = `dice.svg#${type}`
    return html`
      <button
        class='button'
        aria-label=${description}
        onclick=${click}>
        <svg class='icon'>
          <use xlink:href=${icon} />
        </svg>
        <div class='label'>
          ${label}
        </div>
      </button>
    `
  }
})
