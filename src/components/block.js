const html = require('choo/html')
const css = require('sheetify')

const prefix = css`
  a { line-height: 1; display: table-cell; vertical-align: middle; box-sizing: border-box; }
  a:hover { cursor: pointer; }
  a:empty { height: 1em; }
`
const block = (state, size, send) => {
  if (!state.color || !state.charactor) {
    return ''
  }

  console.assert(typeof state.color === 'string', 'color is not string')
  console.assert(typeof state.charactor === 'string', 'charactor is not string')

  const sizing = `width:${size}px;height:${size}px`

  return html`
    <div class="${prefix}">
      <a class="ba b--black-40 link dim db tc bg-${state.color}" style="${sizing}">${state.charactor}</a>
    </div>
  `
}

module.exports = block
