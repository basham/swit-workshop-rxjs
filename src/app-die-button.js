import { html } from 'lighterhtml'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, fromProperty, renderComponent, useSubscribe } from './util.js'
import css from './app-die-button.css'

adoptStyles(css)

whenAdded('[is="app-die-button"]', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()

  const faces$ = fromProperty(el, 'faces', { defaultValue: 6, type: Number })
  const label$ = fromProperty(el, 'label', { defaultValue: '', type: String })

  const render$ = combineLatestProps({
    faces: faces$,
    label: label$
  }).pipe(
    renderComponent(el, render)
  )
  subscribe(render$)

  return unsubscribe
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
