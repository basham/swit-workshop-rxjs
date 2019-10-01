import { define, html, render } from '../src/util/dom/lighterhtml.js'
import { useState } from './02-05-state.js'

define('countdown-lighterhtml', (el) => {
  const duration = 1000
  const countState = useState(10)

  countState.on((count) => renderComponent(el, count))

  countState.on((count) => {
    if (count === 0) {
      clear()
    }
  })

  const timerId = setInterval(() => {
    countState.set((count) => count - 1)
  }, duration)

  function clear () {
    clearInterval(timerId)
    countState.clear()
  }

  return () => clear()
})

function renderComponent (el, count) {
  render(el, () => html`
    Countdown: ${count}
  `)
}
