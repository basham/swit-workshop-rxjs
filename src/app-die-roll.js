import { html } from 'lighterhtml'
import { BehaviorSubject, Subject, range, timer } from 'rxjs'
import { concatMap, scan, switchMap, tap } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, random, randomItem, range as numRange, renderComponent } from './util.js'
import css from './app-die-roll.css'

adoptStyles(css)

whenAdded('app-die-roll', (el) => {
  const faces = parseInt(el.getAttribute('faces') || 6)
  const value = parseInt(el.getAttribute('value')) || random(1, faces)

  const roll$ = new Subject()
  const value$ = new BehaviorSubject(value)

  function roll () {
    roll$.next(null)
  }

  el.faces = faces
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
      const options = numRange(faces, 1)
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
    faces,
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
    const type = `d${faces}`
    return html`
      <app-die
        click=${roll}
        description=${`${value}, ${type}`}
        faces=${faces}
        label=${value}
        size='medium'
        theme='solid' />
    `
  }
})
