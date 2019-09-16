import { render } from 'lighterhtml'
import { BehaviorSubject, Observable, combineLatest, isObservable, of } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'

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
    }
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
