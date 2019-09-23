import { html } from 'lighterhtml'
import { Subject, merge } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, createKeychain, decodeDiceFormula, fromEventSelector, fromProperty, range as numRange, renderComponent } from './util.js'
import css from './app-dice-board.css'

adoptStyles(css)

whenAdded('app-dice-board', (el) => {
  const formula$ = fromProperty(el, 'formula', { defaultValue: '', type: String })
  const getKey = createKeychain()

  const diceSets$ = formula$.pipe(
    map(decodeDiceFormula),
    map((diceSet) =>
      diceSet
        .filter(({ dieCount }) => dieCount)
        .map(({ dieCount, faceCount, type }) => {
          const key = getKey(type)
          const dice = numRange(dieCount)
            .map((i) => getKey(`${type}-${i}`))
            .map((key) => ({ key, faceCount }))
          return { dieCount, dice, key }
        })
    ),
    shareReplay(1)
  )

  const componentDidUpdate$ = new Subject()

  const rollSub = merge(
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
  ).subscribe()

  const renderSub = combineLatestProps({
    diceSets: diceSets$
  }).pipe(
    renderComponent(el, render)
  ).subscribe(componentDidUpdate$)

  function roll () {
    el.querySelectorAll('app-die-roll')
      .forEach((die) => die.roll())
  }

  el.roll = roll

  return () => {
    rollSub.unsubscribe()
    renderSub.unsubscribe()
  }
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
