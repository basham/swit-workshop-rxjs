import { html } from 'lighterhtml'
import { fromEvent } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, renderComponent } from './util.js'
import css from './app-root.css'

adoptStyles(css)

whenAdded('app-root', (el) => {
  const formula$ = fromEvent(el, 'change-formula').pipe(
    map(({ detail }) => detail),
    startWith('')
  )

  const renderSub = combineLatestProps({
    formula: formula$
  }).pipe(
    renderComponent(el, render)
  ).subscribe()

  return () => {
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
