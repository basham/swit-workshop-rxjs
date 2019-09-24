import { tap } from 'rxjs/operators'

// Display the current value in the stream.
// Try some alternative logging types: dir, error, table, warn
export const debug = (message = '', type = 'log') => (source$) => source$.pipe(
  tap((value) => {
    console.group(message)
    console[type](value)
    console.groupEnd()
  })
)
