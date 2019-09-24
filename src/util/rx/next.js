import { tap } from 'rxjs/operators'

// Operator for pushing the current value of a stream to a Subject.
// Equivalent effect of: source$.subscribe(subject$)
export const next = (subject$) => (source$) => source$.pipe(
  tap((value) => {
    subject$.next(value)
  })
)
