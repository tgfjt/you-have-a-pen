const html = require('choo/html')
const css = require('sheetify')

const prefix = css`
  a { line-height: 1; }
  a:hover { cursor: pointer; }
  a:empty { height: 1em; }
`
const block = (state, send) => {
  if (!state.color || !state.charactor) {
    return ''
  }

  console.assert(typeof state.color === 'string', 'color is not string')
  console.assert(typeof state.charactor === 'string', 'charactor is not string')

  return html`
    <div class="${prefix}">
      <a class="ba b--black-30 link dim pa2 db tc w1 bg-${state.color}">${state.charactor}</a>
    </div>
  `
}

module.exports = block
