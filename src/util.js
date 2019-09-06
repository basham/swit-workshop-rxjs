import { render } from 'lighterhtml'
import { combineLatest, isObservable, of } from 'rxjs'
import { map, tap } from 'rxjs/operators'

export const combineLatestProps = (source) => {
  const streamKeys = Object.keys(source)
    .filter((key) => isObservable(source[key]))
  if (!streamKeys.length) {
    return of(source)
  }
  const streams = streamKeys
    .map((key) => source[key])
  return combineLatest(streams).pipe(
    map((values) =>
      values
        .reduce((out, value, i) => {
          const key = streamKeys[i]
          out[key] = value
          return out
        }, { ...source })
    )
  )
}

export function pluralize (value, str) {
  return `${str}${value === 1 ? '' : 's'}`
}

export function random (min, max) {
  return Math.round(Math.random() * (max - min)) + min
}

export function randomItem (source) {
  return source[random(0, source.length - 1)]
}

// https://stackoverflow.com/a/10050831
export function range (size, startAt = 0) {
  return [ ...Array(size).keys() ]
    .map((i) => i + startAt)
}

export const renderComponent = (element, renderer) => (source$) => source$.pipe(
  tap((props) => render(element, () => renderer(props)))
)
