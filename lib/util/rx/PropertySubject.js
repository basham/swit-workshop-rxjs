import { BehaviorSubject } from 'rxjs'

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
