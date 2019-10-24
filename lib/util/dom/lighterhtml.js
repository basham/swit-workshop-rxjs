import { render } from 'lighterhtml'
import { renderComponentFactory } from '../rx.js'

export * from 'lighterhtml'
export * from 'when-elements'
export * from './adoptStyles.js'
export * from './define.js'

// Map empty objects to strings.
// Use for render looping with lighterhtml's html.for(ref) API.
// This is done for the same reason as React's key prop.
// However, lighterhtml expects an object, not a string.
export function keychain () {
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

export const renderComponent = renderComponentFactory(
  ({ element, props, renderer }) => render(element, () => renderer(props))
)
