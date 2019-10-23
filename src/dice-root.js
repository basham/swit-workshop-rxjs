import { distinctUntilChanged, map, shareReplay, startWith, tap } from 'rxjs/operators'
import { define, html, renderComponent } from './util/dom.js'
import { combineLatestObject, fromEventSelector, useSubscribe } from './util/rx.js'

define('dice-root', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()

  const formula$ = fromEventSelector(el, 'dice-picker', 'formula-changed').pipe(
    map(({ detail }) => detail),
    startWith('')
  )

  const rollBoard$ = fromEventSelector(el, 'dice-tray', 'tray-changed').pipe(
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

  const rollAll$ = fromEventSelector(el, 'dice-toolbar button[data-roll]', 'click').pipe(
    tap(() => el.querySelector('dice-tray').roll())
  )
  subscribe(rollAll$)

  const removeAll$ = fromEventSelector(el, 'dice-toolbar button[data-reset]', 'click').pipe(
    tap(() => el.querySelector('dice-picker').reset())
  )
  subscribe(removeAll$)

  const render$ = combineLatestObject({
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
    <dice-picker />
    <dice-toolbar
      count=${count}
      total=${total} />
    <dice-tray formula=${formula} />
  `
}
