import { render } from 'lighterhtml'
import { combineLatest, isObservable, of } from 'rxjs'
import { map, tap } from 'rxjs/operators'

export const combineLatestProps = (source) => {
  const keys = Object.keys(source)
  const streams = keys
    .filter((key) => isObservable(source[key]))
    .map((key) =>
      source[key].pipe(
        map((value) => ({ [key]: value }))
      )
    )
  if (!streams.length) {
    return of(source)
  }
  const data = keys
    .filter((key) => !isObservable(source[key]))
    .map((key) => ({ [key]: source[key] }))
    .reduce((out, value) => ({ ...out, ...value }), {})
  return combineLatest(streams).pipe(
    map((props) =>
      props
        .reduce((out, value) => ({ ...out, ...value }), data)
    ),
    map((props) =>
      keys
        .reduce((out, key) => ({ ...out, [key]: props[key] }), {})
    )
  )
}

export function pluralize (value, str) {
  return `${str}${value === 1 ? '' : 's'}`
}

export const renderComponent = (element, renderer) => (source$) => source$.pipe(
  tap((props) => render(element, () => renderer(props)))
)
