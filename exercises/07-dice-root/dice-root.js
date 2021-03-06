import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged, map, mapTo, shareReplay, startWith, tap } from 'rxjs/operators'
import { define, html, renderComponent } from '/lib/util/dom.js'
import { combineLatestObject, fromEventSelector, next, useSubscribe } from '/lib/util/rx.js'

define('dice-root', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()

  const formula$ = new BehaviorSubject('1d4 1d6 1d8 1d10 1d12 1d20')

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
    mapTo(''),
    next(formula$)
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
    <dice-toolbar
      count=${count}
      total=${total} />
    <dice-tray formula=${formula} />
  `
}
