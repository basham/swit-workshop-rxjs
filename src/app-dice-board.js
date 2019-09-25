import { Subject, merge } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'
import { range } from './util/array.js'
import { decodeFormula } from './util/dice.js'
import { adoptStyles, define, html, keychain, renderComponent } from './util/dom.js'
import { combineLatestObject, fromEventSelector, fromMethod, fromProperty, next, useSubscribe } from './util/rx.js'
import css from './app-dice-board.css'

adoptStyles(css)

define('app-dice-board', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()

  const formula$ = fromProperty(el, 'formula', { defaultValue: '', type: String })
  const getKey = keychain()

  const diceSets$ = formula$.pipe(
    map(decodeFormula),
    map((diceSet) =>
      diceSet
        .filter(({ dieCount }) => dieCount)
        .map(({ dieCount, faceCount, type }) => {
          const key = getKey(type)
          const dice = range(dieCount)
            .map((i) => getKey(`${type}-${i}`))
            .map((key) => ({ key, faceCount }))
          return { dieCount, dice, key }
        })
    ),
    shareReplay(1)
  )

  const componentDidUpdate$ = new Subject()

  const results$ = merge(
    fromEventSelector(el, 'app-die-roll', 'value-changed'),
    componentDidUpdate$
  ).pipe(
    map(() => {
      const dice = [ ...el.querySelectorAll('app-die-roll') ]
        .map(({ faces, value }) => ({ faces, value }))
        .filter(({ value }) => value)
      const count = dice.length
      const total = dice
        .reduce((sum, { value }) => (sum + value), 0)
      const results = dice
        .reduce((all, { faces, value }) => {
          const type = `d${faces}`
          return {
            ...all,
            [type]: [ ...(all[type] || []), value ].sort()
          }
        }, {})
      return { count, results, total }
    }),
    tap((value) => {
      const { count, results, total } = value
      el.count = count
      el.results = results
      el.total = total
      const event = new CustomEvent('roll-board', {
        bubbles: true,
        detail: value
      })
      el.dispatchEvent(event)
    })
  )
  subscribe(results$)

  const roll$ = fromMethod(el, 'roll').pipe(
    tap(() => {
      el.querySelectorAll('app-die-roll')
        .forEach((die) => die.roll())
    })
  )
  subscribe(roll$)

  const render$ = combineLatestObject({
    diceSets: diceSets$
  }).pipe(
    renderComponent(el, render),
    next(componentDidUpdate$)
  )
  subscribe(render$)

  return unsubscribe
})

function render (props) {
  const { diceSets } = props
  return html`${diceSets.map(renderDiceSet)}`
}

function renderDiceSet (props) {
  const { dice, key } = props
  return html.for(key)`
    <div class='dice-set'>
      ${dice.map(renderDie)}
    </div>
  `
}

function renderDie (props) {
  const { faceCount, key } = props
  return html.for(key)`
    <app-die-roll faces=${faceCount} />
  `
}
