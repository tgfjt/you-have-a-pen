const html = require('choo/html')
const css = require('sheetify')

const colors = [
  'block--lgray',
  'block--lgreen',
  'block--dgreen',
  'block--black'
]

const prefix = css`
  a { line-height: 1; }
  a:hover { cursor: pointer; }
  a:empty { height: 1em; }
  .block--black { background-color: #111; color: #f0f0f0; }
  .block--lgreen { background: #b8d8d9; color: #365c5b; }
  .block--dgreen { background: #768c8b; color: #e8e8f9; }
  .block--lgray { background: #f4f4f9; color: #333; }
`
const block = (state, send) => {
  console.assert(typeof state.row === 'number', 'row is not number')
  console.assert(typeof state.col === 'number', 'col is not number')
  console.assert(typeof state.color === 'string', 'color is not string')
  console.assert(typeof state.charactor === 'string', 'charactor is not string')

  const onClick = (e) => {
    e.preventDefault()
    console.log(state)
  }

  return html`
    <div class="${prefix}">
      <a class="link dim pa1 pa3-m pa4-l db tc w1" onclick=${onClick}>${state.charactor || 'e'}</a>
    </div>
  `
}

module.exports = block
