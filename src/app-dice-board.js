import { html } from 'lighterhtml'
import { fromEvent, merge } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
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
        .map((value) => value.match(/(\d+)d(\d+)/i))
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
    ),
    shareReplay(1)
  )

  const roll$ = merge(
    fromEvent(el, 'roll'),
    diceGroups$
  ).pipe(
    map(() => {
      const dice = [ ...el.querySelectorAll('app-die-roll') ]
        .map(({ sides, value = 0 }) => ({ sides, value }))
      const total = dice
        .reduce((sum, { value }) => (sum + value), 0)
      const results = dice
        .reduce((all, { sides, value }) => {
          const type = `d${sides}`
          return {
            ...all,
            [type]: [ ...(all[type] || []), value ].sort()
          }
        }, {})
      const count = dice.length
      return { count, results, total }
    })
  )

  const rollSub = roll$.subscribe((value) => {
    const { count, results, total } = value
    el.count = count
    el.results = results
    el.total = total
    const event = new CustomEvent('boardRoll', {
      bubbles: true,
      detail: value
    })
    el.dispatchEvent(event)
  })

  const renderSub = combineLatestProps({
    diceGroups: diceGroups$
  }).pipe(
    renderComponent(el, renderRoot)
  ).subscribe()

  function roll () {
    el.querySelectorAll('app-die-roll')
      .forEach((d) => d.roll())
  }

  el.roll = roll

  return () => {
    rollSub.unsubscribe()
    renderSub.unsubscribe()
  }

  function renderRoot (props) {
    const { diceGroups } = props
    return html`${diceGroups.map(renderDiceGroup)}`
  }

  function renderDiceGroup (props) {
    const { dice, key } = props
    return html.for(key)`
      <div>
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
