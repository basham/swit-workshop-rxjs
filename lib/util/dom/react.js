import { render } from 'react-dom'
import { renderComponentFactory } from '../rx.js'

export * from 'htm/react'
export * from 'react'
export * from 'react-dom'
export * from './adoptStyles.js'
export * from './define.js'

export const renderComponent = renderComponentFactory(
  ({ element, props, renderer }) => render(renderer(props), element)
)
