import { html } from 'lighterhtml'
import { BehaviorSubject, Subject } from 'rxjs'
import { map, mapTo, shareReplay, tap, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, createKeychain, decodeDiceFormula, range as numRange, renderComponent, encodeDiceFormula } from './util.js'
import css from './app-dice-picker.css'

adoptStyles(css)

whenAdded('app-dice-picker', (el) => {
  const value$ = new BehaviorSubject('3d6 1d10')
  dispatch(value$.getValue())

  const diceSets$ = value$.pipe(
    map(decodeDiceFormula),
    shareReplay(1)
  )

  const getKey = createKeychain()

  const picker$ = diceSets$.pipe(
    map((diceSets) =>
      diceSets
        .map((diceSet) => {
          const { dieCount, faceCount, type } = diceSet
          const key = getKey(type)
          const dice = numRange(dieCount)
            .map((i) => `${type}-${i}`)
            .map((id) => ({ key: getKey(id), faceCount }))
          return { ...diceSet, dice, key }
        })
    )
  )

  const modifyDice$ = new Subject()
  const modifyDice = (value) => modifyDice$.next(value)

  const removeAll$ = new Subject()
  const removeAll = () => removeAll$.next(null)

  const reducerClearSub = removeAll$.pipe(
    mapTo(''),
    tap((value) => {
      el.querySelector('.picker').focus()
      dispatch(value)
    }),
  ).subscribe(value$)

  // TASK
  // Have a single stream for each action type.
  // Replace this with custom operator.
  // modify((count) => (count + 1))
  // modify((count) => (count <= 0 ? 0 : count - 1))
  const incrementDice = (key) => modifyDice({ action: 'increment', key })
  const decrementDice = (key) => modifyDice({ action: 'decrement', key })

  const reducerSub = modifyDice$.pipe(
    withLatestFrom(diceSets$),
    map(([ event, diceSets ]) => {
      const { action, key } = event
      const { dieCount } = diceSets.find(({ type }) => type === key)
      const newDieCount = countFromAction({ action, count: dieCount })
      return diceSets
        .map((diceSet) => {
          const { type } = diceSet
          return type === key
            ? { ...diceSet, dieCount: newDieCount }
            : diceSet
        })

      function countFromAction ({ action, count = 0 }) {
        if (action === 'increment') {
          return count + 1
        }
        if (action === 'decrement') {
          return count <= 0 ? 0 : count - 1
        }
        return count
      }
    }),
    map(encodeDiceFormula),
    tap(dispatch)
  ).subscribe(value$)

  const renderSub = combineLatestProps({
    picker: picker$
  }).pipe(
    renderComponent(el, renderRoot)
  ).subscribe()

  el.removeAll = removeAll

  return () => {
    reducerClearSub.unsubscribe()
    reducerSub.unsubscribe()
    renderSub.unsubscribe()
  }

  function dispatch (value) {
    el.value = value
    const event = new CustomEvent('formulaChange', {
      bubbles: true,
      detail: value
    })
    el.dispatchEvent(event)
  }

  function renderRoot (props) {
    const { picker } = props
    return html`
      <div
        class='picker'
        tabindex='-1'>
        ${picker.map(renderDieControl)}
      </div>
    `
  }

  function renderDieControl (props) {
    const { dieCount, faceCount, type } = props
    const add = () => incrementDice(type)
    const remove = () => decrementDice(type)
    return html`
      <div class='picker__label'>
        ${type}
      </div>
      <app-die-button
        click=${add}
        description=${`Add ${type}`}
        faces=${faceCount}
        size='small'
        theme=${dieCount ? 'solid' : 'ghost'} />
      <button
        aria-label=${`Remove ${type}, ${dieCount} total`}
        class='picker__button'
        disabled=${!dieCount}
        onclick=${remove}>
        &times; ${dieCount}
      </button>
    `
  }
})
