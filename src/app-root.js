import { html } from 'lighterhtml'
import { fromEvent } from 'rxjs'
import { distinctUntilChanged, map, startWith } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, renderComponent } from './util.js'
import css from './app-root.css'

adoptStyles(css)

whenAdded('app-root', (el) => {
  const dice$ = fromEvent(el, 'dicePickerChange').pipe(
    map(({ detail }) => detail),
    startWith({})
  )

  const boardRoll$ = fromEvent(el, 'boardRoll').pipe(
    map(({ detail }) => detail)
  )

  const count$ = boardRoll$.pipe(
    map(({ count }) => count),
    startWith(0),
    distinctUntilChanged()
  )

  const total$ = boardRoll$.pipe(
    map(({ total }) => total),
    startWith(0),
    distinctUntilChanged()
  )

  const renderSub = combineLatestProps({
    count: count$,
    formula: '2d6 1d10',
    total: total$
  }).pipe(
    renderComponent(el, renderRoot)
  ).subscribe()

  return () => {
    renderSub.unsubscribe()
  }

  function removeAllDice () {
    el.querySelector('app-dice-picker').removeAll()
  }

  function rollDice () {
    el.querySelector('app-dice-board').roll()
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
