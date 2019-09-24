import { render } from 'lighterhtml'
import { Observable, Subject, Subscription, combineLatest, from, fromEvent, isObservable, of, BehaviorSubject } from 'rxjs'
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

export function fromMethod (target, name) {
  const method$ = new Subject()
  const handler = (value) => method$.next(value)
  target[name] = handler
  return method$
}

export function fromProperty (target, name, options) {
  return new PropertySubject(target, name, options)
}

// options
//   attribute: true (default), false, 'custom-attribute-name', false
//     If false, the attribute is ignored.
//   defaultValue: (any)
//     Initial value if the attribute or property are not already set.
//   event: true (default), false, 'custom-event-name'
//     Automatically dispatch custom events for property changes.
//     If true, event names will be in the form of `${name}-changed`.
//   reflect: true (default), false
//     If true, property changes are syncronized with the attribute.
//     Note, input controls tend to not reflect their value as an attribute.
//   type: String (default), Number, Boolean, Array, Object
//     Automatically encode and decode string-based attribute values to other types.
//   value: (any)
//     Initial value regardless of initial attribute or property values.
export function PropertySubject (target, name, options = {}) {
  const {
    attribute = true,
    defaultValue,
    event = true,
    reflect = true,
    type = String,
    value
  } = options
  this._private = { attribute, defaultValue, event, name, target, reflect, type, value }
  this._private.attributeName = getAttributeName.call(this)
  this._private.eventName = getEventName.call(this)

  const initialValue = getInitialValue.call(this)
  this._super.call(this, initialValue)

  reflectAttribute.call(this)
  observeProperty.call(this)
  this._private.unsubscribe = observeAttribute.call(this)
}

PropertySubject.prototype = Object.create(BehaviorSubject.prototype)

PropertySubject.prototype.constructor = PropertySubject

PropertySubject.prototype._super = BehaviorSubject

PropertySubject.prototype.next = function (value) {
  const { _super } = this
  const isEqual = encode.call(this, this.getValue()) === encode.call(this, value)

  if (isEqual) {
    return
  }

  _super.prototype.next.call(this, value)
  reflectAttribute.call(this)
  dispatchPropertyChangeEvent.call(this)
}

PropertySubject.prototype._subscribe = function (subscriber) {
  const { _private, _super } = this
  const { unsubscribe } = _private
  const subscription = _super.prototype._subscribe.call(this, subscriber)
  subscription.add(unsubscribe)
  return subscription
}

function decode (value) {
  const { _private } = this
  const { type } = _private
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

function dispatchPropertyChangeEvent () {
  const { _private, value } = this
  const { eventName, target } = _private

  if (!eventName) {
    return
  }

  const event = new CustomEvent(eventName, {
    bubbles: true,
    detail: value
  })
  target.dispatchEvent(event)
}

function encode (value) {
  const { _private } = this
  const { type } = _private
  if (type === Boolean) {
    return JSON.stringify(!!value)
  }
  if (type === String) {
    return value
  }
  return JSON.stringify(value)
}

function getAttribute () {
  const { _private } = this
  const { attributeName, target } = _private
  const value = target.getAttribute(attributeName)
  return decode.call(this, value)
}

function getAttributeName () {
  const { _private } = this
  const { attribute, name } = _private
  return typeof attribute === 'string'
    ? attribute
    : attribute
      ? name
      : undefined
}

function getEventName () {
  const { _private } = this
  const { event, name } = _private
  return typeof event === 'string'
    ? event
    : event
      ? `${name}-changed`
      : undefined
}

function getInitialValue () {
  const { _private } = this
  const { attributeName, defaultValue, name, target, value } = _private
  if (value !== undefined) {
    return value
  }
  if (attributeName) {
    const attr = getAttribute.call(this)
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
  const { _private } = this
  const { attributeName, reflect, target } = _private

  if (!attributeName || !reflect) {
    return () => {}
  }

  const subject$ = this

  const mutationObserver = new MutationObserver((mutationsList) =>
    mutationsList
      .filter(({ type }) => type === 'attributes')
      .filter((mutation) => mutation.attributeName === attributeName)
      .forEach(() => {
        subject$.next(getAttribute.call(subject$))
      })
  )
  mutationObserver.observe(target, { attributes: true });
  return () => mutationObserver.disconnect()
}

function observeProperty () {
  const { _private } = this
  const { name, target } = _private
  const subject$ = this

  Object.defineProperty(target, name, {
    configurable: true,
    get () {
      return subject$.getValue()
    },
    set (value) {
      subject$.next(value)
    }
  })
}

function reflectAttribute () {
  const { _private, value } = this
  const { attributeName, reflect, target, type } = _private

  if (!attributeName || !reflect) {
    return
  }

  if (type === Boolean) {
    if (value) {
      target.setAttribute(attributeName, '')
    } else {
      target.removeAttribute(attributeName)
    }
  } else {
    target.setAttribute(attributeName, encode.call(this, value))
  }
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

// Operator for pushing the current value of a stream to a Subject.
// Equivalent effect of: source$.subscribe(subject$)
export const next = (subject$) => (source$) => source$.pipe(
  tap((value) => {
    subject$.next(value)
  })
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

export function useCallbackStack () {
  const stack = new Set()
  const add = (value) => {
    if (typeof value === 'function') {
      stack.add(value)
    }
  }
  const call = () => {
    stack.forEach((callback) => callback())
    stack.clear()
  }
  return [ add, call ]
}

export function useSubscribe () {
  const [ add, unsubscribe ] = useCallbackStack()
  const subscribe = (source) => {
    if (isObservable(source)) {
      const sub = source.subscribe()
      add(() => sub.unsubscribe())
      return sub
    }
    if (source instanceof Subscription) {
      add(() => source.unsubscribe())
      return source
    }
    if (typeof source === 'function') {
      add(source)
      return
    }
  }
  return [ subscribe, unsubscribe ]
}
