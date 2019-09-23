import { html } from 'lighterhtml'
import { combineLatest, fromEvent, merge } from 'rxjs'
import { map, mapTo, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, fromEventSelector, fromProp, renderComponent } from './util.js'
import css from './app-dice-picker-control.css'

adoptStyles(css)

whenAdded('app-dice-picker-control', (el) => {
  const faces$ = fromProp(el, 'faces', { defaultValue: 6, type: Number })
  const value$ = fromProp(el, 'value', { defaultValue: 0, type: Number })

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
  const reset$ = fromEvent(document, 'remove-all-dice').pipe(
    mapTo(0)
  )
  const changeValueSub = merge(
    increment$,
    decrement$,
    reset$
  ).subscribe((value) => {
    el.value = value
  })

  const dispatchSub = combineLatest(
    faces$,
    value$
  ).subscribe(([ faces, value ]) => {
    const event = new CustomEvent('change-picker-control', {
      bubbles: true,
      detail: {
        faces,
        value
      }
    })
    el.dispatchEvent(event)
  })

  const renderSub = combineLatestProps({
    faces: faces$,
    type: type$,
    value: value$
  }).pipe(
    renderComponent(el, render)
  ).subscribe()

  return () => {
    changeValueSub.unsubscribe()
    dispatchSub.unsubscribe()
    renderSub.unsubscribe()
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
