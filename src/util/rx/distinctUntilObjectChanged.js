import { distinctUntilChanged } from 'rxjs/operators'

// Make `distinctUntilChanged` operator work with deeply nested objects.
export const distinctUntilObjectChanged = () => (source$) => source$.pipe(
  distinctUntilChanged(null, (value) => JSON.stringify(value))
)
