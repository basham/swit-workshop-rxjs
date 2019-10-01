window.customElements.define('component-custom-elements', class RootCustomElements extends HTMLElement {
  constructor () {
    super()
    // In general, the constructor should be used
    // to set up initial state and default values,
    // and to set up event listeners and possibly
    // a shadow root.
    //
    // In general, work should be deferred to
    // connectedCallback as much as possible —
    // especially work involving fetching resources
    // or rendering. However, note that connectedCallback
    // can be called more than once, so any initialization
    // work that is truly one-time will need a guard
    // to prevent it from running twice.
    // https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance
    this.innerHTML = 'Component'
  }

  connectedCallback () {
    // On mount
  }

  disconnectedCallback () {
    // On unmount
  }

  attributeChangedCallback (name, oldValue, newValue) {
    // On attribute change
  }
})
