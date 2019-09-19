import { html } from 'lighterhtml'
import { fromEvent } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, renderComponent } from './util.js'
import css from './app-toolbar.css'

adoptStyles(css)

whenAdded('app-toolbar', (el) => {
  const rollBoard$ = fromEvent(document, 'roll-board').pipe(
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
    removeAllDice,
    rollDice,
    total: total$
  }).pipe(
    renderComponent(el, render)
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
})

function render (props) {
  const { count, removeAllDice, rollDice, total } = props
  return html`
    <div class=${count ? '' : 'hidden'}>
      <div class='total'>
        <span class='total__count'>
          ${total}
        </span>
        <span class='total__label'>
          Total
        </span>
      </div>
      <button
        class='button'
        onclick=${rollDice}>
        Roll
      </button>
      <button
        class='button'
        onclick=${removeAllDice}>
        Remove all
      </button>
    </div>
  `
}
