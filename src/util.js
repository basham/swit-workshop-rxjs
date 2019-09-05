import { render } from 'lighterhtml'
import { combineLatest, isObservable, of } from 'rxjs'
import { map, tap } from 'rxjs/operators'

export const combineLatestProps = (source) => {
  const keys = Object.keys(source)
  const streamKeys = keys
    .filter((key) => isObservable(source[key]))
  if (!streamKeys.length) {
    return of(source)
  }
  const streams = streamKeys
    .map((key) => source[key])
  const data = keys
    .filter((key) => !isObservable(source[key]))
    .reduce((out, key) => ({ ...out, [key]: source[key] }), {})
  return combineLatest(streams).pipe(
    map((values) =>
      values
        .map((value, i) => ({ [streamKeys[i]]: value }))
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
