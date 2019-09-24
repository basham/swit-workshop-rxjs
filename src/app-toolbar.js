import { adoptStyles, html, renderComponent, whenAdded } from './util/dom.js'
import { combineLatestProps, fromProperty, useSubscribe } from './util/rx.js'
import css from './app-toolbar.css'

adoptStyles(css)

whenAdded('app-toolbar', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()

  const count$ = fromProperty(el, 'count', { defaultValue: 0, type: Number })
  const total$ = fromProperty(el, 'total', { defaultValue: 0, type: Number })

  const render$ = combineLatestProps({
    count: count$,
    total: total$
  }).pipe(
    renderComponent(el, render)
  )
  subscribe(render$)

  return unsubscribe
})

function render (props) {
  const { count, total } = props
  return html`
    <div class=${count ? '' : 'hidden'}>
      <div class='total'>
        <span class='total__count'>
          ${total}
        </span>
        <span class='total__label'>
          Total
        </span>
      </div>
      <button
        class='button'
        data-roll>
        Roll
      </button>
      <button
        class='button'
        data-reset>
        Remove all
      </button>
    </div>
  `
}
