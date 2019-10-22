# Web Components

https://www.webcomponents.org/introduction

## 1. ES modules

```html
<script type="module" src="my-component.js"></script>
```

```js
import { foo } from './module.js'

export const bar = foo
```

## 2. Custom elements

### Autonomous custom element

```html
<my-component>Render something</my-component>
```

```js
window.customElements.define('my-component', class MyComponent extends HTMLElement {
  //...
})
```

### Customized built-in element

```html
<button is="my-button">Do something</button>
```

```js
window.customElements.define('my-button', class MyButton extends HTMLButton {
  //...
}, { extends: 'button' })
```

## 3. Shadow DOM

```js
const div = document.createElement('div')
const shadowRoot = div.attachShadow({ mode: 'open' })
shadowRoot.innerHTML = `
  <p>
    Shadow realm
    <slot></slot>
  </p>
`
```

```html
<!-- Input -->
<div id="thing">is cool</div>

<!-- Output -->
<div id="thing">
  <p>
    Shadow realm
    is cool
  </p>
</div>
```

## 4. HTML templates

```html
<template id="template">
  <p>Template</p>
</template>
```

```js
const shadowRoot = element.attachShadow({ mode: 'open' })
const template = document.getElementById('template')
shadowRoot.appendChild(template.content.cloneNode(true))
```
