import { html } from 'lighterhtml'
import { BehaviorSubject, Subject, fromEvent, merge, range, timer } from 'rxjs'
import { concatMap, map, scan, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, fromAttribute, fromEventSelector, random, randomItem, range as numRange, renderComponent } from './util.js'
import css from './app-die-roll.css'

adoptStyles(css)

whenAdded('app-die-roll', (el) => {
  const value$ = new BehaviorSubject(1)
  const faces$ = fromAttribute(el, 'faces').pipe(
    map((value) => parseInt(value) || 6),
    tap((faces) => {
      el.faces = faces
    })
  )
  const rollAll$ = fromEvent(document, 'roll-all-dice')
  const rollDie$ = fromEventSelector(el, 'button', 'click')

  const rollSub = merge(
    rollAll$,
    rollDie$
  ).pipe(
    // Immediately roll.
    startWith(null),
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
    withLatestFrom(faces$),
    map(([ , faces ]) => faces),
    // Randomly choose a side, while preventing repeats.
    scan((lastRoll, faces) => {
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
    faces: faces$,
    value: value$
  }).pipe(
    renderComponent(el, render)
  ).subscribe()

  return () => {
    rollSub.unsubscribe()
    renderSub.unsubscribe()
  }
})

function render (props) {
  const { faces, value } = props
  const type = `d${faces}`
  return html`
    <app-die-button
      description=${`${value}, ${type}`}
      faces=${faces}
      label=${value}
      size='medium'
      theme='solid' />
  `
}
