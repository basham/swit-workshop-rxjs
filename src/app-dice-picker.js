import { html } from 'lighterhtml'
import { BehaviorSubject, Subject } from 'rxjs'
import { map, mapTo, tap, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { FACES } from './constants.js'
import { adoptStyles, combineLatestProps, createKeychain, range as numRange, renderComponent } from './util.js'
import css from './app-dice-picker.css'

adoptStyles(css)

whenAdded('app-dice-picker', (el) => {
  const dice$ = new BehaviorSubject({ d6: 2, d20: 1 })
  dispatch(dice$.getValue())

  const getKey = createKeychain()

  const picker$ = dice$.pipe(
    map((bag) =>
      FACES
        .map((faceCount) => {
          const type = `d${faceCount}`
          const key = getKey(type)
          const dieCount = bag[type] || 0
          const dice = numRange(dieCount)
            .map((i) => `${type}-${i}`)
            .map((id) => ({ key: getKey(id), id, faceCount }))
          return { dice, dieCount, faceCount, key, type }
        })
    )
  )

  const modifyDice$ = new Subject()
  const modifyDice = (value) => modifyDice$.next(value)

  const removeAll$ = new Subject()
  const removeAll = () => removeAll$.next(null)

  const reducerClearSub = removeAll$.pipe(
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
      const { [key]: thisFace, ...otherFaces } = dice
      return count === 0
        ? otherFaces
        : { ...otherFaces, [key]: count }

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

  el.removeAll = removeAll

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
        ${picker.map(renderDieInput)}
      </div>
    `
  }

  function renderDieInput (props) {
    const { dieCount, faceCount, type } = props
    const add = () => incrementDice(type)
    const remove = () => decrementDice(type)
    return html`
      <div class='picker__label'>
        ${type}
      </div>
      <app-die
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
