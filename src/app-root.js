import { distinctUntilChanged, map, shareReplay, startWith, tap } from 'rxjs/operators'
import { adoptStyles, html, renderComponent, whenAdded } from './util/dom.js'
import { combineLatestProps, fromEventSelector, useSubscribe } from './util/rx.js'
import css from './app-root.css'

adoptStyles(css)

whenAdded('app-root', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()

  const formula$ = fromEventSelector(el, 'app-dice-picker', 'formula-changed').pipe(
    map(({ detail }) => detail),
    startWith('')
  )

  const rollBoard$ = fromEventSelector(el, 'app-dice-board', 'roll-board').pipe(
    map(({ detail }) => detail),
    shareReplay(1)
  )
  const count$ = rollBoard$.pipe(
    map(({ count }) => count),
    startWith(0),
    distinctUntilChanged()
  )
  const total$ = rollBoard$.pipe(
    map(({ total }) => total),
    startWith(0),
    distinctUntilChanged()
  )

  const rollAll$ = fromEventSelector(el, 'app-toolbar button[data-roll]', 'click').pipe(
    tap(() => el.querySelector('app-dice-board').roll())
  )
  subscribe(rollAll$)

  const removeAll$ = fromEventSelector(el, 'app-toolbar button[data-reset]', 'click').pipe(
    tap(() => el.querySelector('app-dice-picker').reset())
  )
  subscribe(removeAll$)

  const render$ = combineLatestProps({
    count: count$,
    formula: formula$,
    total: total$
  }).pipe(
    renderComponent(el, render)
  )
  subscribe(render$)

  return unsubscribe
})

function render (props) {
  const { count, formula, total } = props
  return html`
    <app-dice-picker />
    <app-toolbar
      count=${count}
      total=${total} />
    <app-dice-board formula=${formula} />
  `
}
