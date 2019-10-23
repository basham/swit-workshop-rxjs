// Import styles with CSS Modules.
// https://github.com/guybedford/es-module-shims
//
// Adopt styles polyfill.
// https://github.com/calebdwilliams/construct-style-sheets

import 'construct-style-sheets-polyfill'

export function adoptStyles () {
  document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, ...arguments ]
}
