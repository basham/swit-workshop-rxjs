import { fromSelector } from './fromSelector.js'
import { mapEvent } from './mapEvent.js'

export function fromEventSelector (target, selector, eventName, options) {
  return fromSelector(target, selector).pipe(
    mapEvent(eventName, options)
  )
}
