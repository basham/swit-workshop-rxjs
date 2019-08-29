import { render } from 'lighterhtml'
import { combineLatest, isObservable } from 'rxjs'
import { map, tap } from 'rxjs/operators'

export const combineLatestProps = (source) => {
  const streams = Object.keys(source)
    .filter((key) => isObservable(source[key]))
    .map((key) =>
      source[key].pipe(
        map((value) => ({ [key]: value }))
      )
    )
  const data = Object.keys(source)
    .filter((key) => !isObservable(source[key]))
    .map((key) => ({ [key]: source[key] }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {})
  return combineLatest(streams).pipe(
    map((props) =>
      props
        .reduce((prev, curr) => ({ ...prev, ...curr }), data)
    )
  )
}

export function pluralize (value, str) {
  return `${str}${value === 1 ? '' : 's'}`
}

export const renderComponent = (element, renderer) => (source$) => source$.pipe(
  tap((props) => render(element, () => renderer(props)))
)
