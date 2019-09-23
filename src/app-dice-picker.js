import { html } from 'lighterhtml'
import { fromEvent } from 'rxjs'
import { map, scan, tap, distinctUntilChanged } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, decodeDiceFormula, encodeDiceFormula, fromMethod, fromProperty, renderComponent, useSubscribe } from './util.js'
import css from './app-dice-picker.css'

adoptStyles(css)

whenAdded('app-dice-picker', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()

  const formula$ = fromProperty(el, 'formula', { defaultValue: '', reflect: false, type: String })
  const picker$ = formula$.pipe(
    map(decodeDiceFormula)
  )

  const changeValue$ = fromEvent(el, 'change-picker-control').pipe(
    scan((all, event) => {
      const { detail } = event
      const { faces, value } = detail
      return { ...all, [faces]: value }
    }, {}),
    map((diceMap) =>
      Object.entries(diceMap)
        .map((entry) => entry.map((v) => parseInt(v)))
        .map(([ faceCount, dieCount ]) => ({ dieCount, faceCount }))
    ),
    map(encodeDiceFormula),
    distinctUntilChanged(),
    tap((formula) => {
      el.formula = formula
    })
  )
  subscribe(changeValue$)

  const reset$ = fromMethod(el, 'reset').pipe(
    tap(() => {
      el.querySelectorAll('app-dice-picker-control')
        .forEach((control) => control.reset())
      el.setAttribute('tabindex', -1)
      el.focus()
    })
  )
  subscribe(reset$)

  const render$ = combineLatestProps({
    picker: picker$
  }).pipe(
    renderComponent(el, render)
  )
  subscribe(render$)

  return unsubscribe
})

function render (props) {
  const { picker } = props
  return html`
    ${picker.map(renderControl)}
  `
}

function renderControl (props) {
  const { faceCount } = props
  return html`
    <app-dice-picker-control faces=${faceCount} />
  `
}
