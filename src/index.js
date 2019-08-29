import { html, render } from 'lighterhtml'

function renderApp () {
  const dice = [ 4, 6, 8, 10, 12, 20 ]
  return html`
    <h1>Dice</h1>
    <h2>Select dice</h2>
    <ul>
      ${dice.map((d) => renderDice(d))}
    </ul>
  `
}

function renderDice (value) {
  return html`
    <li>
      <button>d${value}</button>
    </li>
  `
}

render(document.getElementById('app'), renderApp)
