import { define, html, render } from '../src/util/dom/lighterhtml.js'

define('countdown-lighterhtml', (el) => {
  const duration = 1000
  let count = 10

  renderComponent()

  const timerId = setInterval(() => {
    count = count - 1
    renderComponent()

    if (count === 0) {
      clearInterval(timerId)
    }
  }, duration)

  function renderComponent () {
    render(el, () => html`
      Countdown: ${count}
    `)
  }
})
