import { tap } from 'rxjs/operators'
import { distinctUntilObjectChanged } from './distinctUntilObjectChanged.js'

export const renderComponentFactory = (adapter) => (element, renderer) => (source$) => source$.pipe(
  distinctUntilObjectChanged(),
  tap((props) => adapter({ element, props, renderer }))
)
