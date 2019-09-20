import { html } from 'lighterhtml'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, debug, fromProp, renderComponent } from './util.js'
import css from './app-die-button.css'

adoptStyles(css)

whenAdded('[is="app-die-button"]', (el) => {
  const faces$ = fromProp(el, 'faces', { type: Number }).pipe(
    debug('Faces')
  )
  const label$ = fromProp(el, 'label')

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
