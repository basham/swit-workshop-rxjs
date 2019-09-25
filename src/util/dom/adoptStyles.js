export function adoptStyles (css) {
  document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, css ]
}
