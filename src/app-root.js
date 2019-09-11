import { html } from 'lighterhtml'
import { BehaviorSubject, Subject } from 'rxjs'
import { map, shareReplay, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { combineLatestProps, createKeychain, range as numRange, renderComponent } from './util.js'
import css from './app-root.css'

document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, css ]

const DICE_SIDES = [ 4, 6, 8, 10, 12, 20 ]

whenAdded('app-root', (el) => {
  const dice$ = new BehaviorSubject({ d6: 2, d20: 1 })

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

  const diceGrid$ = dice$.pipe(
    map((bag) =>
      DICE_SIDES
        .map((sideCount) => {
          const type = `d${sideCount}`
          const dieCount = bag[type] || 0
          const dice = numRange(dieCount)
            .map((i) => `${type}-${i}`)
            .map((id) => ({ key: diceKeys(id), id, sideCount }))
          return { sideCount, dieCount, dice, type }
        })
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
    diceGrid: diceGrid$
  }).pipe(
    renderComponent(el, renderRoot)
  ).subscribe()

  return () => {
    rollSub.unsubscribe()
    reducerSub.unsubscribe()
    renderSub.unsubscribe()
  }

  function renderRoot (props) {
    const { diceGrid } = props
    return html`
      <h1>Dice</h1>
      <div>
        <button onclick=${rollDice}>Roll</button>
      </div>
      <div class='board'>
        ${diceGrid.map(renderDiceGroup)}
      </div>
    `
  }

  function renderDiceGroup (props) {
    const { dice, dieCount, type } = props
    const add = () => incrementDice(type)
    const remove = () => decrementDice(type)
    return html`
      <h2 class='board__type'>${type}</h2>
      <button
        aria-label=${`Add ${type}`}
        onclick=${add}>
        +
      </button>
      <button
        aria-label=${`Remove ${type}`}
        disabled=${!dieCount}
        onclick=${remove}>
        &minus;
      </button>
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
