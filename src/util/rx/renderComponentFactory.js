import { pipe } from 'rxjs'
import { tap } from 'rxjs/operators'
import { distinctUntilObjectChanged } from './distinctUntilObjectChanged.js'

export const renderComponentFactory = (adapter) => (element, renderer) => pipe(
  distinctUntilObjectChanged(),
  tap((props) => adapter({ element, props, renderer }))
)
