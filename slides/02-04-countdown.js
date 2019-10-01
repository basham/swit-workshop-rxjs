import { define } from '../src/util/dom/define.js'

define('countdown-innerhtml', (el) => {
  const duration = 1000
  let count = 10

  // Initial render.
  renderComponent()

  // Countdown every second.
  // Stop when zero.
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

  // This will clear the container's DOM every time.
  // Use a library to diff the DOM.
  function renderComponent () {
    el.innerHTML = `
      Countdown: ${count}
    `
  }

  // Cancel the interval when the component
  // is removed from the DOM.
  return () => clear()
})
