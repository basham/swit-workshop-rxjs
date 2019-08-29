import { html } from 'lighterhtml'
import { BehaviorSubject, Subject } from 'rxjs'
import { map, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { combineLatestProps, renderComponent } from './util.js'

const DICE_SIDES = [ 4, 6, 8, 10, 12, 20 ]
  .map((sides) => `d${sides}`)

whenAdded('#app', (el) => {
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
    )
  )

  const modifyDice$ = new Subject()
  const modifyDice = (value) => modifyDice$.next(value)

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
    diceSides: DICE_SIDES
  }).pipe(
    renderComponent(el, renderApp)
  ).subscribe()

  return () => sub.unsubscribe()

  function renderApp (props) {
    const { diceList, diceSides } = props
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
