import { html } from 'lighterhtml'
import { map, startWith, tap } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, fromEventSelector, renderComponent, useSubscribe } from './util.js'
import css from './app-root.css'

adoptStyles(css)

whenAdded('app-root', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()

  const formula$ = fromEventSelector(el, 'app-dice-picker', 'formula-changed').pipe(
    map(({ detail }) => detail),
    startWith('')
  )

  const rollAll$ = fromEventSelector(el, 'app-toolbar', 'roll-all-dice').pipe(
    tap(() => el.querySelector('app-dice-board').roll())
  )
  subscribe(rollAll$)

  const render$ = combineLatestProps({
    formula: formula$
  }).pipe(
    renderComponent(el, render)
  )
  subscribe(render$)

  return unsubscribe
})

function render (props) {
  const { formula } = props
  return html`
    <app-dice-picker />
    <app-toolbar />
    <app-dice-board formula=${formula} />
  `
}
