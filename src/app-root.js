import { html } from 'lighterhtml'
import { fromEvent } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, startWith, tap } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, renderComponent } from './util.js'
import css from './app-root.css'

adoptStyles(css)

whenAdded('app-root', (el) => {
  const formula$ = fromEvent(el, 'change-formula').pipe(
    map(({ detail }) => detail),
    startWith(''),
  )

  const rollBoard$ = fromEvent(el, 'roll-board').pipe(
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

  const renderSub = combineLatestProps({
    count: count$,
    formula: formula$,
    total: total$
  }).pipe(
    renderComponent(el, renderRoot)
  ).subscribe()

  return () => {
    renderSub.unsubscribe()
  }

  function removeAllDice () {
    const event = new CustomEvent('remove-all-dice', {
      bubbles: true
    })
    el.dispatchEvent(event)
  }

  function rollDice () {
    const event = new CustomEvent('roll-all-dice', {
      bubbles: true
    })
    el.dispatchEvent(event)
  }

  function renderRoot (props) {
    const { count, formula, total } = props
    return html`
      <app-dice-picker />
      <div class='total'>
        <div class=${total > 0 ? null : 'hidden'}>
          <span class='total__count'>
            ${total}
          </span>
          <span class='total__label'>
            Total
          </span>
        </div>
      </div>
      <div class='toolbar'>
        <button
          class='toolbar__button'
          disabled=${!count}
          onclick=${rollDice}>
          Roll
        </button>
        <button
          class='toolbar__button'
          disabled=${!count}
          onclick=${removeAllDice}>
          Remove all
        </button>
      </div>
      <app-dice-board formula=${formula} />
    `
  }
})
