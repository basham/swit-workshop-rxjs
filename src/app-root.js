import { html } from 'lighterhtml'
import { BehaviorSubject, Subject } from 'rxjs'
import { map, shareReplay, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { combineLatestProps, createKeychain, range as numRange, renderComponent } from './util.js'
import css from './app-root.css'

document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, css ]

const DICE_SIDES = [ 4, 6, 8, 10, 12, 20 ]
  .map((sides) => `d${sides}`)

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

  const allDice$ = diceList$.pipe(
    map((list) =>
      list
        .map(({ count, sides }) =>
          numRange(count)
            .map((i) => `d${sides}-${i}`)
            .map((id) => ({ key: diceKeys(id), id, sides }))
        )
        .flat()
    )
  )

  const modifyDice$ = new Subject()
  const modifyDice = (value) => modifyDice$.next(value)

  // TASK
  // Have a single stream for each action type.
  // Replace this with custom operator.
  // modify((count) => (count + 1))
  // modify((count) => (count <= 0 ? 0 : count - 1))
  const incrementDice = (key) => modifyDice({ action: 'increment', key })
  const decrementDice = (key) => modifyDice({ action: 'decrement', key })

  modifyDice$.pipe(
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

  const sub = combineLatestProps({
    diceList: diceList$,
    allDice: allDice$,
    diceSides: DICE_SIDES
  }).pipe(
    renderComponent(el, renderApp)
  ).subscribe()

  return () => sub.unsubscribe()

  function renderApp (props) {
    const { diceList, diceSides, allDice } = props
    return html`
      <h1>Dice</h1>
      <h2>Add dice</h2>
      <ul class='app-plain-list'>
        ${diceSides.map((d) => renderDiceOption(d))}
      </ul>
      <h2>Selected dice</h2>
      <ul class='app-plain-list app-plus-list'>
        ${diceList.map((d) => renderDiceSet(d))}
      </ul>
      <p>
        <button>Roll</button>
      </p>
      <h2>Dice</h2>
      ${allDice.map(({ key, sides }) =>
        html.for(key)`<app-dice sides=${sides} />`
      )}
    `
  }

  function renderDiceOption (key) {
    const click = () => incrementDice(key)
    return html`
      <li>
        <button onclick=${click}>${key}</button>
      </li>
    `
  }

  function renderDiceSet (props) {
    const { key, label } = props
    const click = () => decrementDice(key)
    return html`
      <li>
        <button onclick=${click}>${label}</button>
      </li>
    `
  }
})
