import { html } from 'lighterhtml'
import { fromEvent, merge, range, timer } from 'rxjs'
import { concatMap, map, scan, startWith, switchMap, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, fromEventSelector, fromMethod, fromProperty, random, randomItem, range as numRange, renderComponent } from './util.js'
import css from './app-die-roll.css'

adoptStyles(css)

whenAdded('app-die-roll', (el) => {
  const faces$ = fromProperty(el, 'faces', { defaultValue: 6, type: Number })
  const value$ = fromProperty(el, 'value', { defaultValue: 1, type: Number })

  //const rollAll$ = fromEvent(document, 'roll-all-dice')
  const rollMethod$ = fromMethod(el, 'roll')
  const rollClick$ = fromEventSelector(el, 'button', 'click')

  const rollSub = merge(
    rollMethod$,
    rollClick$
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
    }, -1)
  ).subscribe((value) => {
    el.value = value
  })

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
    <button
      aria-label=${`${value}, ${type}`}
      faces=${faces}
      is='app-die-button'
      label=${value}
      size='medium'
      theme='solid' />
  `
}
