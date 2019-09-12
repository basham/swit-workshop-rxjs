import { html } from 'lighterhtml'
import { BehaviorSubject, Subject, range, timer } from 'rxjs'
import { concatMap, scan, switchMap, tap } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { combineLatestProps, random, randomItem, range as numRange, renderComponent } from './util.js'
import css from './app-dice.css'

document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, css ]

whenAdded('app-dice', (el) => {
  const sides = parseInt(el.getAttribute('sides') || 6)
  const value = parseInt(el.getAttribute('value')) || random(1, sides)

  const roll$ = new Subject()
  const value$ = new BehaviorSubject(value)

  function roll () {
    roll$.next(null)
  }

  el.roll = roll

  const rollSub = roll$.pipe(
    // Trigger a roll.
    switchMap(() =>
      // Roll to a new side, a random number of times.
      range(0, random(8, 12)).pipe(
        // Wait until one timer completes before starting the next timer.
        concatMap((v, i) =>
          // Each timer should last at least one frame (16ms).
          // Slow down over time, with some variation.
          timer(i * 16 * random(50, 150) / 100)
        )
      )
    ),
    // Randomly choose a side, while preventing repeats.
    scan((lastRoll) => {
      const options = numRange(sides, 1)
        .filter((v) => v !== lastRoll)
      return randomItem(options)
    }, -1),
    tap((value) => {
      el.value = value
      const event = new CustomEvent('roll', {
        bubbles: true,
        detail: value
      })
      el.dispatchEvent(event)
    })
  ).subscribe(value$)

  const renderSub = combineLatestProps({
    sides,
    value: value$
  }).pipe(
    renderComponent(el, render)
  ).subscribe()

  roll()

  return () => {
    rollSub.unsubscribe()
    renderSub.unsubscribe()
  }

  function render (props) {
    const { value } = props
    const type = `d${sides}`
    return html`
      <app-die
        click=${roll}
        description=${`${value}, ${type}`}
        label=${value}
        sides=${sides}
        size='medium'
        theme='dark' />
    `
  }
})
