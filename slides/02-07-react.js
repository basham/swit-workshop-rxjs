import { define, html, render } from '../src/util/dom/react.js'

define('countdown-react', (el) => {
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
    render(html`Countdown: ${count}`, el)
  }

  return () => clear()
})
