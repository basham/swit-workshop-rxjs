import { define } from '../src/util/dom/define.js'

define('countdown-state', (el) => {
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
  el.innerHTML = `
    Countdown: ${count}
  `
}

// Inspired by React hooks.
// https://reactjs.org/docs/hooks-state.html
export function useState (state = null) {
  const listeners = new Set()
  const get = () => state
  const set = (callback) => {
    state = callback(state)
    listeners.forEach((cb) => cb(state))
    return state
  }
  const on = (callback) => {
    listeners.add(callback)
    callback(state)
    return () => {
      listeners.delete(callback)
    }
  }
  const clear = () => {
    listeners.clear()
  }
  return { get, set, on, clear }
}
