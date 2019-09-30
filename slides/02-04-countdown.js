import { define } from '../src/util/dom/define.js'

define('countdown-innerhtml', (el) => {
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

  // This will clear the container's DOM every time.
  // Use a library to diff the DOM.
  function renderComponent () {
    el.innerHTML = `
      Countdown: ${count}
    `
  }
})
