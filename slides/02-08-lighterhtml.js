import { define, html, render } from '/lib/util/dom/lighterhtml.js'

define('countdown-lighterhtml', (el) => {
  const duration = 1000
  let count = 20

  renderComponent()

  const timerId = setInterval(() => {
    count = count - 1
    renderComponent()

    if (count === 0) {
      clear()
    }
  }, duration)

  function clear () {
    clearInterval(timerId)
  }

  function renderComponent () {
    render(el, () => html`Countdown: ${count}`)
  }

  return () => clear()
})
