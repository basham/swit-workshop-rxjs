import { html } from 'lighterhtml'
import { fromEvent } from 'rxjs'
import { map, scan, tap, distinctUntilChanged } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, decodeDiceFormula, encodeDiceFormula, fromProperty, renderComponent } from './util.js'
import css from './app-dice-picker.css'

adoptStyles(css)

whenAdded('app-dice-picker', (el) => {
  const formula$ = fromProperty(el, 'formula', { defaultValue: '', reflect: false, type: String })
  const picker$ = formula$.pipe(
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
    distinctUntilChanged()
  ).subscribe((formula) => {
    el.formula = formula
  })

  const removeAllSub = fromEvent(document, 'remove-all-dice').pipe(
    tap(() => {
      el.setAttribute('tabindex', -1)
      el.focus()
    }),
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
