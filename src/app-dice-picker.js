import { html } from 'lighterhtml'
import { BehaviorSubject, Subject } from 'rxjs'
import { map, mapTo, tap, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, createKeychain, range as numRange, renderComponent } from './util.js'
import css from './app-dice-picker.css'

adoptStyles(css)

const DICE_SIDES = [ 4, 6, 8, 10, 12, 20 ]

whenAdded('app-dice-picker', (el) => {
  const dice$ = new BehaviorSubject({ d6: 2, d20: 1 })
  dispatch(dice$.getValue())

  const diceKeys = createKeychain()

  const picker$ = dice$.pipe(
    map((bag) =>
      DICE_SIDES
        .map((sideCount) => {
          const type = `d${sideCount}`
          const key = diceKeys(type)
          const dieCount = bag[type] || 0
          const dice = numRange(dieCount)
            .map((i) => `${type}-${i}`)
            .map((id) => ({ key: diceKeys(id), id, sideCount }))
          return { sideCount, dieCount, dice, key, type }
        })
    )
  )

  const modifyDice$ = new Subject()
  const modifyDice = (value) => modifyDice$.next(value)

  const clearDice$ = new Subject()
  const clearDice = () => clearDice$.next(null)

  const reducerClearSub = clearDice$.pipe(
    mapTo({}),
    tap((value) => {
      el.querySelector('.picker').focus()
      dispatch(value)
    }),
  ).subscribe(dice$)

  // TASK
  // Have a single stream for each action type.
  // Replace this with custom operator.
  // modify((count) => (count + 1))
  // modify((count) => (count <= 0 ? 0 : count - 1))
  const incrementDice = (key) => modifyDice({ action: 'increment', key })
  const decrementDice = (key) => modifyDice({ action: 'decrement', key })

  const reducerSub = modifyDice$.pipe(
    withLatestFrom(dice$),
    map(([ event, dice ]) => {
      const { action, key } = event
      const count = countFromAction({ action, count: dice[key] })
      const { [key]: thisSide, ...otherSides } = dice
      return count === 0
        ? otherSides
        : { ...otherSides, [key]: count }

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
    tap(dispatch)
  ).subscribe((value) => {
    dice$.next(value)
  })

  const renderSub = combineLatestProps({
    picker: picker$
  }).pipe(
    renderComponent(el, renderRoot)
  ).subscribe()

  el.clearDice = clearDice

  return () => {
    reducerClearSub.unsubscribe()
    reducerSub.unsubscribe()
    renderSub.unsubscribe()
  }

  function dispatch (value) {
    el.value = value
    const event = new CustomEvent('dicePickerChange', {
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
        ${picker.map(renderPickerAddDie)}
      </div>
    `
  }

  function renderPickerAddDie (props) {
    const { dieCount, sideCount, type } = props
    const add = () => incrementDice(type)
    const remove = () => decrementDice(type)
    return html`
      <div class='picker__label'>
        ${type}
      </div>
      <app-die
        click=${add}
        description=${`Add ${type}`}
        sides=${sideCount}
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
