import { render } from 'react-dom'
import { tap } from 'rxjs/operators'
import { distinctUntilObjectChanged } from './rx.js'

export * from 'htm/react'
export * from 'react'
export * from 'react-dom'
export * from 'when-elements'

export function adoptStyles (css) {
  document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, css ]
}

export const renderComponent = (element, renderer) => (source$) => source$.pipe(
  distinctUntilObjectChanged(),
  tap((props) => render(renderer(props), element))
)
