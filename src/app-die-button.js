import { html } from 'lighterhtml'
import { map } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, fromAttribute, renderComponent } from './util.js'
import css from './app-die-button.css'

adoptStyles(css)

whenAdded('[is="app-die-button"]', (el) => {
  const faces$ = fromAttribute(el, 'faces').pipe(
    map((value) => parseInt(value))
  )
  const label$ = fromAttribute(el, 'label')

  const renderSub = combineLatestProps({
    faces: faces$,
    label: label$
  }).pipe(
    renderComponent(el, render)
  ).subscribe()

  return () => {
    renderSub.unsubscribe()
  }
})

function render (props) {
  const { faces, label } = props
  const type = `d${faces}`
  const icon = `dice.svg#${type}`
  return html`
    <svg class='icon'>
      <use xlink:href=${icon} />
    </svg>
    <div class='label'>
      ${label}
    </div>
  `
}
