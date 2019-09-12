import { html } from 'lighterhtml'
import { map } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { combineLatestProps, fromAttribute, fromProperty, renderComponent } from './util.js'
import css from './app-die.css'

document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, css ]

whenAdded('app-die', (el) => {
  const click$ = fromProperty(el, 'click')
  const description$ = fromAttribute(el, 'description')
  const label$ = fromAttribute(el, 'label')
  const sides$ = fromAttribute(el, 'sides').pipe(
    map((value) => parseInt(value) || 6)
  )

  const renderSub = combineLatestProps({
    click: click$,
    description: description$,
    label: label$,
    sides: sides$
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
        aria-label=${description}
        class='button'
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
