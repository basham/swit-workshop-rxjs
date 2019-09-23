import { render } from 'lighterhtml'
import { BehaviorSubject, Observable, combineLatest, from, fromEvent, isObservable, of } from 'rxjs'
import { distinctUntilChanged, filter, map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators'
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

// Display the current value in the stream.
// Try some alternative logging types: dir, error, table, warn
export const debug = (message = '', type = 'log') => (source$) => source$.pipe(
  tap((value) => {
    console.group(message)
    console[type](value)
    console.groupEnd()
  })
)

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

// options
//   attribute: true (default), false, 'custom-attr-name'
//   defaultValue: (any)
//     Initial value if the attribute or property isn't already set.
//   eventName: `${name}-changed` (default), 'custom-event-name'
//     Automatically dispatch custom events for property changes.
//   reflect: true (default), false
//     Set to false primarily for input values.
//     Get the default value via attribute, but otherwise ignore it.
//   type: String (default), Number, Boolean, Array, Object
//   value: (any)
//     Initial value regardless of initial attribute or property values.
export function fromProp (target, name, options = {}) {
  const { attribute = true, defaultValue, eventName = `${name}-changed`, reflect = true, type = String, value } = options
  const attributeName = getAttributeName()

  return new Observable((subscriber) => {
    let _value = undefined

    Object.defineProperty(target, name, {
      configurable: true,
      get () {
        return _value
      },
      set (value) {
        if (encode(_value) === encode(value)) {
          return
        }
        _value = value
        if (attributeName && reflect) {
          if (type === Boolean) {
            if (value) {
              target.setAttribute(attributeName, '')
            } else {
              target.removeAttribute(attributeName)
            }
          } else {
            target.setAttribute(attributeName, encode(value))
          }
        }
        const event = new CustomEvent(eventName, {
          bubbles: true,
          detail: value
        })
        target.dispatchEvent(event)
        subscriber.next(value)
      }
    })

    target[name] = initialValue()

    const unsubscribe = observeAttribute()

    return unsubscribe
  })

  function decode (value) {
    if (type === Boolean) {
      return Boolean(value)
    }
    if (type === Number) {
      return Number(value)
    }
    if (type === String) {
      return value || ''
    }
    return JSON.parse(value)
  }

  function encode (value) {
    if (type === Boolean) {
      return JSON.stringify(!!value)
    }
    if (type === String) {
      return value
    }
    return JSON.stringify(value)
  }

  function getAttribute () {
    return decode(target.getAttribute(attributeName))
  }

  function getAttributeName () {
    return typeof attribute === 'string'
      ? attribute
      : attribute
        ? name
        : undefined
  }

  function initialValue () {
    if (value !== undefined) {
      return value
    }
    if (attributeName) {
      const attr = getAttribute()
      if (attr) {
        return attr
      }
    }
    if (target[name] !== undefined) {
      return target[name]
    }
    return defaultValue
  }

  function observeAttribute () {
    if (!attributeName || !reflect) {
      return () => {}
    }

    const mutationObserver = new MutationObserver((mutationsList) =>
      mutationsList
        .filter(({ type }) => type === 'attributes')
        .filter((mutation) => mutation.attributeName === attributeName)
        .forEach(() => {
          target[name] = getAttribute()
        })
    )
    mutationObserver.observe(target, { attributes: true });
    return () => mutationObserver.disconnect()
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
  })
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

export function fromSelector (target, selector) {
  return new Observable((subscriber) => {
    const next = () => {
      subscriber.next([ ...target.querySelectorAll(selector) ])
    }
    next()
    const mutationObserver = new MutationObserver(() => {
      next()
    })
    mutationObserver.observe(target, {
      attributes: true,
      childList: true,
      subtree: true
    })
    return () => mutationObserver.disconnect()
  }).pipe(
    distinctUntilChanged(isArrayEqual)
  )
}

export function fromEventSelector (target, selector, eventName, options) {
  return fromSelector(target, selector).pipe(
    mapEvent(eventName, options)
  )
}

export function isArrayEqual (a, b) {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

// Map an array of elements to a stream of events.
// Only events dispatched from these elements are emitted.
// All bubbled events from descendant elements are ignored.
//
// Inspired by CycleJS DOM
// https://cycle.js.org/api/dom.html
export const mapEvent = (eventName, options) => (source$) => source$.pipe(
  switchMap((elements) =>
    from(elements).pipe(
      mergeMap((element) =>
        fromEvent(element, eventName, options).pipe(
          filter(({ target }) => target === element)
        )
      )
    )
  )
)

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
