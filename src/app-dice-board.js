import { html } from 'lighterhtml'
import { fromEvent } from 'rxjs'
import { filter, map, startWith, tap } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, createKeychain, fromAttribute, range as numRange, renderComponent } from './util.js'
import css from './app-dice-board.css'

adoptStyles(css)

const DICE_SIDES = [ 4, 6, 8, 10, 12, 20 ]

whenAdded('app-dice-board', (el) => {
  const getKey = createKeychain()

  const diceGroups$ = fromAttribute(el, 'formula').pipe(
    map((value) => value ? value : ''),
    map((formula) =>
      formula
        .split(' ')
        .map((value) => value.match(/(\d+)d(\d+)/))
        .filter((match) => match)
        .map(([ , dieCount, sideCount ]) => [ parseInt(sideCount), parseInt(dieCount) ])
        .filter(([ sideCount ]) => DICE_SIDES.includes(sideCount))
        .sort((a, b) => a[0] - b[0])
        .map(([ sideCount, dieCount ]) => {
          const type = `d${sideCount}`
          const key = getKey(type)
          const dice = numRange(dieCount)
            .map((i) => getKey(`${type}-${i}`))
            .map((key) => ({ key, sideCount }))
          return { dieCount, dice, key }
        })
    )
  )

  const renderSub = combineLatestProps({
    diceGroups: diceGroups$
  }).pipe(
    renderComponent(el, renderRoot)
  ).subscribe()

  return () => {
    renderSub.unsubscribe()
  }

  function renderRoot (props) {
    const { diceGroups } = props
    return html`${diceGroups.map(renderDiceGroup)}`
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
      <app-die-roll sides=${sideCount} />
    `
  }
})
