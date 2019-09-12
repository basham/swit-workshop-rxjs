import { html } from 'lighterhtml'
import { BehaviorSubject, Subject, fromEvent, merge } from 'rxjs'
import { distinctUntilChanged, map, mapTo, shareReplay, startWith, tap, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { combineLatestProps, createKeychain, range as numRange, renderComponent } from './util.js'
import css from './app-root.css'

document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, css ]

const DICE_SIDES = [ 4, 6, 8, 10, 12, 20 ]

whenAdded('app-root', (el) => {
  const dice$ = new BehaviorSubject({ d6: 2, d20: 1 })

  const diceCount$ = dice$.pipe(
    map((d) =>
      Object.values(d)
        .reduce((sum, count) => (sum + count), 0)
    ),
    distinctUntilChanged()
  )

  const diceNotion$ = dice$.pipe(
    map((d) =>
      Object.entries(d)
        .map(([ key, count ]) => {
          const label = `${count}${key}`
          const sides = parseInt(key.substring(1))
          return { key, count, label, sides }
        })
        .sort((a, b) => a.sides - b.sides)
        .map(({ label }) => label)
        .join(' + ')
    ),
    distinctUntilChanged()
  )

  const diceList$ = dice$.pipe(
    map((d) =>
      Object.entries(d)
        .map(([ key, count ]) => {
          const label = `${count}${key}`
          const sides = parseInt(key.substring(1))
          return { key, count, label, sides }
        })
        .sort((a, b) => a.sides - b.sides)
    ),
    shareReplay(1)
  )

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

  const diceGrid$ = dice$.pipe(
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
        .filter(({ dieCount }) => dieCount > 0)
    )
  )

  const rollDice$ = new Subject()
  const rollDice = () => rollDice$.next(null)

  const rollSub = rollDice$.subscribe(() => {
    el.querySelectorAll('app-dice')
      .forEach((d) => d.roll())
  })

  const modifyDice$ = new Subject()
  const modifyDice = (value) => modifyDice$.next(value)

  const clearDice$ = new Subject()
  const clearDice = () => clearDice$.next(null)

  const reducerClearSub = clearDice$.pipe(
    tap(() => {
      el.querySelector('.picker').focus()
    }),
    mapTo({})
  ).subscribe(dice$)

  const total$ = merge(
    fromEvent(el, 'roll'),
    dice$
  ).pipe(
    map(() =>
      [ ...el.querySelectorAll('app-dice') ]
        .map(({ value = 0 }) => value)
        .reduce((sum, value) => (sum + value), 0)
    ),
    startWith(0),
    distinctUntilChanged()
  )

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
    })
  ).subscribe((value) => {
    dice$.next(value)
  })

  const renderSub = combineLatestProps({
    count: diceCount$,
    grid: diceGrid$,
    notation: diceNotion$,
    picker: picker$,
    total: total$
  }).pipe(
    renderComponent(el, renderRoot)
  ).subscribe()

  return () => {
    rollSub.unsubscribe()
    reducerClearSub.unsubscribe()
    reducerSub.unsubscribe()
    renderSub.unsubscribe()
  }

  function renderRoot (props) {
    const { grid, total } = props
    return html`
      <h1>Dice</h1>
      ${renderPicker(props)}
      <div class='total'>
        ${total > 0 ? total : null}
      </div>
      <div class='board'>
        ${grid.map(renderDiceGroup)}
      </div>
    `
  }

  function renderPicker (props) {
    const { count, notation, picker } = props
    return html`
      <div
        class='picker'
        tabindex='-1'>
        <h2 class='picker__label'>
          ${count ? notation : 'Select Dice'}
        </h2>
        ${picker.map(renderPickerAddDie)}
        <button
          class='picker__clear'
          disabled=${!count}
          onclick=${clearDice}>
          Clear
        </button>
        <button
          class='picker__roll'
          disabled=${!count}
          onclick=${rollDice}>
          Roll
        </button>
      </div>
    `
  }

  function renderPickerAddDie (props) {
    const { sideCount, type } = props
    const add = () => incrementDice(type)
    const icon = `dice.svg#${type}`
    return html`
      <button
        class=${`picker__die picker__die--${type}`}
        aria-label=${`Add ${type}`}
        onclick=${add}>
        <svg class='picker__die-icon'>
          <use xlink:href=${icon} />
        </svg>
        <div class='picker__die-label'>
          ${sideCount}
        </div>
      </button>
    `
  }

  function renderDiceGroup (props) {
    const { dice, key } = props
    return html.for(key)`
      <div class='board__dice'>
        ${dice.map(renderDie)}
      </div>
    `
  }

  function renderDie (props) {
    const { key, sideCount } = props
    return html.for(key)`
      <app-dice sides=${sideCount} />
    `
  }
})
