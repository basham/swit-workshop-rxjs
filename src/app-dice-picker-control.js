import { html } from 'lighterhtml'
import { BehaviorSubject, fromEvent, merge } from 'rxjs'
import { map, mapTo, shareReplay, tap, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, fromAttribute, fromEventSelector, renderComponent } from './util.js'
import css from './app-dice-picker-control.css'

adoptStyles(css)

whenAdded('app-dice-picker-control', (el) => {
  const value$ = new BehaviorSubject(0)
  const faces$ = fromAttribute(el, 'faces').pipe(
    map((value) => parseInt(value) || 6),
    tap((faces) => {
      el.faces = faces
    }),
    shareReplay(1)
  )
  const type$ = faces$.pipe(
    map((faces) => `d${faces}`)
  )

  el.faces = parseInt(el.getAttribute('faces'))
  dispatch(value$.getValue())

  const increment$ = fromEventSelector(el, '.increment-button', 'click').pipe(
    withLatestFrom(value$),
    map(([ , value ]) => value + 1)
  )

  const decrement$ = fromEventSelector(el, '.decrement-button', 'click').pipe(
    withLatestFrom(value$),
    map(([ , value ]) => value <= 0 ? 0 : value - 1)
  )

  const reset$ = fromEvent(document, 'remove-all-dice').pipe(
    mapTo(0)
  )

  const changeValueSub = merge(
    increment$,
    decrement$,
    reset$
  ).pipe(
    tap(dispatch)
  ).subscribe(value$)

  const renderSub = combineLatestProps({
    faces: faces$,
    type: type$,
    value: value$
  }).pipe(
    renderComponent(el, render)
  ).subscribe()

  return () => {
    changeValueSub.unsubscribe()
    renderSub.unsubscribe()
  }

  function dispatch (value) {
    el.value = value
    const event = new CustomEvent('change-picker-control', {
      bubbles: true,
      detail: {
        faces: el.faces,
        value
      }
    })
    el.dispatchEvent(event)
  }
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
