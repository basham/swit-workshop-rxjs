import { html } from 'lighterhtml'
import { map, startWith } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, fromEventSelector, renderComponent } from './util.js'
import css from './app-root.css'

adoptStyles(css)

whenAdded('app-root', (el) => {
  const formula$ = fromEventSelector(el, 'app-dice-picker', 'formula-changed').pipe(
    map(({ detail }) => detail),
    startWith('')
  )

  const rollAllSub = fromEventSelector(el, 'app-toolbar', 'roll-all-dice').subscribe(() => {
    el.querySelector('app-dice-board').roll()
  })

  const renderSub = combineLatestProps({
    formula: formula$
  }).pipe(
    renderComponent(el, render)
  ).subscribe()

  return () => {
    rollAllSub.unsubscribe()
    renderSub.unsubscribe()
  }
})

function render (props) {
  const { formula } = props
  return html`
    <app-dice-picker />
    <app-toolbar />
    <app-dice-board formula=${formula} />
  `
}
