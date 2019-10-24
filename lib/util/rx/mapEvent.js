import { from, fromEvent } from 'rxjs'
import { filter, mergeMap, switchMap } from 'rxjs/operators'

// Map an array of elements to a stream of events.
// Only events dispatched from these elements are emitted.
// All bubbled events from descendant elements are ignored.
//
// Inspired by CycleJS DOM
// https://cycle.js.org/api/dom.html
export const mapEvent = (eventName, options) =>
  switchMap((elements) =>
    from(elements).pipe(
      mergeMap((element) =>
        fromEvent(element, eventName, options).pipe(
          filter(({ target }) => target === element)
        )
      )
    )
  )
