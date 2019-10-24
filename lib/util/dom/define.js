import { whenAdded } from 'when-elements'

const disconnectedCallbacks = new WeakMap()
const noop = () => {}
const useFallback = !hasCustomElements()

// <my-element>
// define('my-element', callback)
//
// <button is="my-button">
// define('my-button', 'button', callback)
//
// Use customElements if available.
// Otherwise, fallback to WhenElements.
export function define (name, extendsElement, callback) {
  if (useFallback) {
    return defineFallback(name, extendsElement, callback)
  }

  if (arguments.length === 2) {
    callback = extendsElement
    extendsElement = undefined
  }
  const options = extendsElement ? { extends: extendsElement } : undefined
  customElements.define(name, class extends interfaceFromTagName(extendsElement) {
    connectedCallback () {
      const cb = callback(this) || noop
      disconnectedCallbacks.set(this, cb)
    }
    disconnectedCallback () {
      disconnectedCallbacks.get(this)()
    }
  }, options)
}

function defineFallback (name, extendsElement, callback) {
  let selector = name
  if (callback) {
    selector = `${extendsElement}[is="${name}"]`
  } else {
    callback = extendsElement
  }
  whenAdded(selector, callback)
}

// Detection script via:
// https://github.com/ungap/custom-elements-builtin
function hasCustomElements () {
  if (!window.customElements) {
    return false
  }
  try {
    customElements.define('built-in', interfaceFromTagName('p'), { 'extends': 'p' })
  } catch(_) {
    return false
  }
  return true
}

function interfaceFromTagName (name) {
  return name ? document.createElement(name).constructor : HTMLElement
}
