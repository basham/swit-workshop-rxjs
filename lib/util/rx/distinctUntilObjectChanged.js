import { distinctUntilChanged } from 'rxjs/operators'

// Make `distinctUntilChanged` operator work with deeply nested objects.
export const distinctUntilObjectChanged = () =>
  distinctUntilChanged(null, (value) => JSON.stringify(value))
