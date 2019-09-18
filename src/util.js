import { render } from 'lighterhtml'
import { BehaviorSubject, Observable, combineLatest, isObservable, of } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'
import { FACES } from './constants.js'

export function adoptStyles (css) {
  document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, css ]
}

export const combineLatestProps = (source) => {
  const streamKeys = Object.keys(source)
    .filter((key) => isObservable(source[key]))
  if (!streamKeys.length) {
    return of(source)
  }
  const streams = streamKeys
    .map((key) => source[key])
  return combineLatest(streams).pipe(
    map((values) =>
      values
        .reduce((out, value, i) => {
          const key = streamKeys[i]
          out[key] = value
          return out
        }, { ...source })
    )
  )
}

// Map empty objects to strings.
// Use for render looping with lighterhtml's html.for(ref) API.
// This is done for the same reason as React's key prop.
// However, lighterhtml expects an object, not a string.
export function createKeychain () {
  const keys = new Map()

  return function getKey (id) {
    if (keys.has(id)) {
      return keys.get(id)
    }
    const key = {}
    keys.set(id, key)
    return key
  }
}

// In: '2d6 1d20'
// Out:
//   [
//     { dieCount: 0, faceCount: 4, notation: '0d4', type: 'd4' },
//     { dieCount: 2, faceCount: 6, notation: '2d6', type: 'd6' },
//     { dieCount: 0, faceCount: 8, notation: '0d8', type: 'd8' },
//     { dieCount: 0, faceCount: 10, notation: '0d10', type: 'd10' },
//     { dieCount: 0, faceCount: 12, notation: '0d12', type: 'd12' },
//     { dieCount: 1, faceCount: 20, notation: '1d20', type: 'd20' }
//   ]
export function decodeDiceFormula (formula) {
  const dice = (formula || '')
    .split(' ')
    .map((value) => value.match(/(\d+)d(\d+)/i))
    .filter((match) => match)
    .map(([ , dieCount, faceCount ]) => [ parseInt(faceCount), parseInt(dieCount) ])
    .map(([ faceCount, dieCount ]) => ({ [faceCount]: dieCount }))
    .reduce((all, value) => ({ ...all, ...value }), {})
  return FACES
    .map((faceCount) => {
      const dieCount = dice[faceCount] || 0
      const type = `d${faceCount}`
      const notation = `${dieCount}${type}`
      return { dieCount, faceCount, notation, type }
    })
}

// In:
//   [
//     { dieCount: 2, faceCount: 6 },
//     { dieCount: 1, faceCount: 20 }
//   ]
// Out: '2d6 1d20'
export function encodeDiceFormula (diceSets) {
  return diceSets
    .filter(({ dieCount }) => dieCount)
    .filter(({ faceCount }) => FACES.includes(faceCount))
    .sort((a, b) => a.faceCount - b.faceCount)
    .map(({ dieCount, faceCount }) => `${dieCount}d${faceCount}`)
    .join(' ')
}

export function fromAttribute (target, name) {
  return new Observable((subscriber) => {
    const next = () => subscriber.next(target.getAttribute(name))
    next()
    const mutationObserver = new MutationObserver((mutationsList) =>
      mutationsList
        .filter(({ type }) => type === 'attributes')
        .filter(({ attributeName }) => attributeName === name)
        .forEach(next)
    )
    mutationObserver.observe(target, { attributes: true });
    return () => mutationObserver.disconnect()
  }).pipe(
    shareReplay(1)
  )
}

// Listen to an element property change.
// Useful for getting `data` or `props` properties from lighterhtml elements.
export function fromProperty (target, name) {
  const property$ = new BehaviorSubject(target[name])
  Object.defineProperty(target, name, {
    get () {
      return property$.getValue()
    },
    set (value) {
      property$.next(value)
    },
    configurable: true
  })
  return property$
}

export function pluralize (value, str) {
  return `${str}${value === 1 ? '' : 's'}`
}

export function random (min, max) {
  return Math.round(Math.random() * (max - min)) + min
}

export function randomItem (source) {
  return source[random(0, source.length - 1)]
}

// https://stackoverflow.com/a/10050831
export function range (size, startAt = 0) {
  return [ ...Array(size).keys() ]
    .map((i) => i + startAt)
}

export const renderComponent = (element, renderer) => (source$) => source$.pipe(
  tap((props) => render(element, () => renderer(props)))
)
