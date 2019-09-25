import { render } from 'react-dom'
import { renderComponentFactory } from '../rx.js'

export * from 'htm/react'
export * from 'react'
export * from 'react-dom'
export * from 'when-elements'
export * from './adoptStyles.js'

export const renderComponent = renderComponentFactory(
  ({ element, props, renderer }) => render(renderer(props), element)
)
