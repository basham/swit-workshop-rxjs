import { html } from 'lighterhtml'
import { BehaviorSubject, Subject, range, timer } from 'rxjs'
import { mergeMap, scan, switchMap, take } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { combineLatestProps, easeInQuad, random, renderComponent } from './util.js'

whenAdded('my-dice', (el) => {
  const sides = parseInt(el.getAttribute('sides') || 6)
  const value = parseInt(el.getAttribute('value')) || null

  const roll$ = new Subject()
  const value$ = new BehaviorSubject(value)

  function roll () {
    roll$.next(null)
  }

  roll$.pipe(
    switchMap(() => {
      const rollCount = random(5, 20)
      const maxRollDuration = random(250, 750) 
      return range(0, rollCount).pipe(
        mergeMap((v, i) =>
          timer(easeInQuad(i / (rollCount - 1)) * maxRollDuration).pipe(
            take(1)
          )
        )
      )
    }),
    scan((lastRoll) => {
      while (true) {
        const r = random(1, sides)
        if (r !== lastRoll) {
          return r
        }
      }
    })
  ).subscribe(value$)

  const sub = combineLatestProps({
    sides,
    value: value$
  }).pipe(
    renderComponent(el, render)
  ).subscribe()

  if (value === null) {
    roll()
  }

  return () => sub.unsubscribe()

  function render (props) {
    const { sides, value } = props
    return html`
      <button class='face' onclick=${roll}>
        ${value}
      </button>
      <div class='type'>
        d${sides}
      </div>
    `
  }
})
