import { Observable } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'
import { isArrayEqual } from '../array.js'

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
