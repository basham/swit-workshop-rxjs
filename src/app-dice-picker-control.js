import { html } from 'lighterhtml'
import { combineLatest, merge } from 'rxjs'
import { map, mapTo, tap, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, fromEventSelector, fromMethod, fromProperty, renderComponent, useSubscribe } from './util.js'
import css from './app-dice-picker-control.css'

adoptStyles(css)

whenAdded('app-dice-picker-control', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()

  const faces$ = fromProperty(el, 'faces', { defaultValue: 6, type: Number })
  const value$ = fromProperty(el, 'value', { defaultValue: 0, type: Number })

  const type$ = faces$.pipe(
    map((faces) => `d${faces}`)
  )

  const increment$ = fromEventSelector(el, '.increment-button', 'click').pipe(
    withLatestFrom(value$),
    map(([ , value ]) => value + 1)
  )
  const decrement$ = fromEventSelector(el, '.decrement-button', 'click').pipe(
    withLatestFrom(value$),
    map(([ , value ]) => value <= 0 ? 0 : value - 1)
  )
  const reset$ = fromMethod(el, 'reset').pipe(
    mapTo(0)
  )
  const changeValue$ = merge(
    increment$,
    decrement$,
    reset$
  ).pipe(
    tap((value) => {
      el.value = value
    })
  )
  subscribe(changeValue$)

  const dispatch$ = combineLatest(
    faces$,
    value$
  ).pipe(
    tap(([ faces, value ]) => {
      const event = new CustomEvent('change-picker-control', {
        bubbles: true,
        detail: {
          faces,
          value
        }
      })
      el.dispatchEvent(event)
    })
  )
  subscribe(dispatch$)

  const render$ = combineLatestProps({
    faces: faces$,
    type: type$,
    value: value$
  }).pipe(
    renderComponent(el, render)
  )
  subscribe(render$)

  return unsubscribe
})

function render (props) {
  const { faces, type, value } = props
  return html`
    <div class='label'>
      ${type}
    </div>
    <button
      aria-label=${`Add ${type}`}
      class='increment-button'
      faces=${faces}
      is="app-die-button"
      size='small'
      theme=${value ? 'solid' : 'ghost'} />
    <button
      aria-label=${`Remove ${type}, ${value} total`}
      class='decrement-button'
      disabled=${!value}>
      &times; ${value}
    </button>
  `
}
