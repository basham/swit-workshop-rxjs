import { html } from 'lighterhtml'
import { fromEvent, of } from 'rxjs'
import { map, scan, tap, distinctUntilChanged } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, decodeDiceFormula, encodeDiceFormula, renderComponent } from './util.js'
import css from './app-dice-picker.css'

adoptStyles(css)

whenAdded('app-dice-picker', (el) => {
  const picker$ = of('').pipe(
    tap(dispatch),
    map(decodeDiceFormula)
  )

  const changeValueSub = fromEvent(el, 'change-picker-control').pipe(
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
    tap(dispatch)
  ).subscribe()

  const removeAllSub = fromEvent(document, 'remove-all-dice').pipe(
    tap(() => {
      el.setAttribute('tabindex', -1)
      el.focus()
    }),
    tap(dispatch)
  ).subscribe()

  const renderSub = combineLatestProps({
    picker: picker$
  }).pipe(
    renderComponent(el, render)
  ).subscribe()

  return () => {
    changeValueSub.unsubscribe()
    removeAllSub.unsubscribe()
    renderSub.unsubscribe()
  }

  function dispatch (value) {
    el.value = value
    const event = new CustomEvent('change-formula', {
      bubbles: true,
      detail: value
    })
    el.dispatchEvent(event)
  }
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
