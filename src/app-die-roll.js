import { html } from 'lighterhtml'
import { BehaviorSubject, Subject, range, timer } from 'rxjs'
import { concatMap, map, scan, switchMap, tap, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, fromAttribute, random, randomItem, range as numRange, renderComponent } from './util.js'
import css from './app-die-roll.css'

adoptStyles(css)

whenAdded('app-die-roll', (el) => {
  const faces$ = fromAttribute(el, 'faces').pipe(
    map((value) => parseInt(value) || 6),
    tap((faces) => {
      el.faces = faces
    })
  )

  const roll$ = new Subject()
  const value$ = new BehaviorSubject(1)

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

  roll()

  return () => {
    rollSub.unsubscribe()
    renderSub.unsubscribe()
  }

  function render (props) {
    const { faces, value } = props
    const type = `d${faces}`
    return html`
      <app-die-button
        click=${roll}
        description=${`${value}, ${type}`}
        faces=${faces}
        label=${value}
        size='medium'
        theme='solid' />
    `
  }
})
