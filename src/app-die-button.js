import { html } from 'lighterhtml'
import { map } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, fromAttribute, renderComponent } from './util.js'
import css from './app-die-button.css'

adoptStyles(css)

whenAdded('app-die-button', (el) => {
  const description$ = fromAttribute(el, 'description')
  const faces$ = fromAttribute(el, 'faces').pipe(
    map((value) => parseInt(value) || 6)
  )
  const label$ = fromAttribute(el, 'label')

  const renderSub = combineLatestProps({
    description: description$,
    label: label$,
    faces: faces$
  }).pipe(
    renderComponent(el, render)
  ).subscribe()

  return () => {
    renderSub.unsubscribe()
  }
})

function render (props) {
  const { description, faces, label } = props
  const type = `d${faces}`
  const icon = `dice.svg#${type}`
  return html`
    <button
      aria-label=${description}
      class='button'>
      <svg class='icon'>
        <use xlink:href=${icon} />
      </svg>
      <div class='label'>
        ${label}
      </div>
    </button>
  `
}
