import { html } from 'lighterhtml'
import { BehaviorSubject, fromEvent, merge } from 'rxjs'
import { map, mapTo, shareReplay, tap, withLatestFrom } from 'rxjs/operators'
import { whenAdded } from 'when-elements'
import { adoptStyles, combineLatestProps, createKeychain, decodeDiceFormula, encodeDiceFormula, fromEventSelector, range as numRange, renderComponent } from './util.js'
import css from './app-dice-picker.css'

adoptStyles(css)

whenAdded('app-dice-picker', (el) => {
  const value$ = new BehaviorSubject('3d6 1d10')
  dispatch(value$.getValue())

  const diceSets$ = value$.pipe(
    map(decodeDiceFormula),
    shareReplay(1)
  )

  const getKey = createKeychain()

  const picker$ = diceSets$.pipe(
    map((diceSets) =>
      diceSets
        .map((diceSet) => {
          const { dieCount, faceCount, type } = diceSet
          const key = getKey(type)
          const dice = numRange(dieCount)
            .map((i) => `${type}-${i}`)
            .map((id) => ({ key: getKey(id), faceCount }))
          return { ...diceSet, dice, key }
        })
    )
  )

  const updateCount = (fn) => (source$) => source$.pipe(
    withLatestFrom(diceSets$),
    map(([ key, diceSets ]) => {
      const { dieCount } = diceSets.find(({ type }) => type === key)
      return [ key, fn(dieCount) ]
    })
  )

  const addDice$ = fromEventSelector(el, '[data-add] button', 'click').pipe(
    map(({ target }) => target.closest('app-die-button').dataset.add),
    updateCount((count) => count + 1)
  )

  const removeDice$ = fromEventSelector(el, 'button[data-remove]', 'click').pipe(
    map(({ target }) => target.dataset.remove),
    updateCount((count) => count <= 0 ? 0 : count - 1)
  )

  const addRemoveSub = merge(
    addDice$,
    removeDice$
  ).pipe(
    withLatestFrom(diceSets$),
    map(([ [ key, dieCount ], diceSets ]) =>
      diceSets
        .map((diceSet) => {
          const { type } = diceSet
          return type === key
            ? { ...diceSet, dieCount }
            : diceSet
        })
    ),
    map(encodeDiceFormula),
    tap(dispatch)
  ).subscribe(value$)

  const removeAll$ = fromEvent(document, 'remove-all-dice')
  const removeAllSub = removeAll$.pipe(
    mapTo(''),
    tap((value) => {
      el.querySelector('.picker').focus()
      dispatch(value)
    }),
  ).subscribe(value$)

  const renderSub = combineLatestProps({
    picker: picker$
  }).pipe(
    renderComponent(el, renderRoot)
  ).subscribe()

  return () => {
    addRemoveSub.unsubscribe()
    removeAllSub.unsubscribe()
    renderSub.unsubscribe()
  }

  function dispatch (value) {
    el.value = value
    const event = new CustomEvent('change-formula', {
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
        ${picker.map(renderDieControl)}
      </div>
    `
  }

  function renderDieControl (props) {
    const { dieCount, faceCount, type } = props
    return html`
      <div class='picker__label'>
        ${type}
      </div>
      <app-die-button
        data-add=${type}
        description=${`Add ${type}`}
        faces=${faceCount}
        size='small'
        theme=${dieCount ? 'solid' : 'ghost'} />
      <button
        aria-label=${`Remove ${type}, ${dieCount} total`}
        class='picker__button'
        data-remove=${type}
        disabled=${!dieCount}>
        &times; ${dieCount}
      </button>
    `
  }
})
