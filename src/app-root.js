import { html } from 'lighterhtml'
import { fromEvent, merge } from 'rxjs'
import { distinctUntilChanged, map, startWith } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, renderComponent } from './util.js'
import css from './app-root.css'

adoptStyles(css)

const DICE_SIDES = [ 4, 6, 8, 10, 12, 20 ]

whenAdded('app-root', (el) => {
  const dice$ = fromEvent(el, 'dicePickerChange').pipe(
    map(({ detail }) => detail),
    startWith({})
  )

  const diceCount$ = dice$.pipe(
    map((d) =>
      Object.values(d)
        .reduce((sum, count) => (sum + count), 0)
    ),
    distinctUntilChanged()
  )

  function rollDice () {
    el.querySelectorAll('app-die-roll')
      .forEach((d) => d.roll())
  }

  function clearDice () {
    el.querySelector('app-dice-picker').clearDice()
  }

  const total$ = merge(
    fromEvent(el, 'roll'),
    dice$
  ).pipe(
    map(() =>
      [ ...el.querySelectorAll('app-die-roll') ]
        .map(({ value = 0 }) => value)
        .reduce((sum, value) => (sum + value), 0)
    ),
    startWith(0),
    distinctUntilChanged()
  )

  const renderSub = combineLatestProps({
    count: diceCount$,
    total: total$
  }).pipe(
    renderComponent(el, renderRoot)
  ).subscribe()

  return () => {
    rollSub.unsubscribe()
    reducerSub.unsubscribe()
    renderSub.unsubscribe()
  }

  function renderRoot (props) {
    const { count, total } = props
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
          onclick=${clearDice}>
          Remove all
        </button>
      </div>
      <app-dice-board formula='1d20 2d6 1d8' />
    `
  }
})
