import { define } from '../src/util/dom/define.js'

define('countdown-innerhtml', (el) => {
  const duration = 1000
  const count = 10
  let currentCount = count

  // Initial render.
  renderComponent()

  // Countdown every second.
  // Stop when zero.
  const timerId = setInterval(() => {
    currentCount = currentCount - 1
    renderComponent()

    if (currentCount === 0) {
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
      Countdown: ${currentCount}
    `
  }

  // Cancel the interval when the component
  // is removed from the DOM.
  return () => clear()
})
