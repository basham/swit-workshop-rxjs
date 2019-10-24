import { Subject } from 'rxjs'

export function fromMethod (target, name) {
  const method$ = new Subject()
  const handler = (value) => method$.next(value)
  target[name] = handler
  return method$
}
