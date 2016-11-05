const html = require('choo/html')

const block = (state, size, send) => {
  if (!state.color || !state.charactor) {
    return ''
  }

  console.assert(typeof state.color === 'string', 'color is not string')
  console.assert(typeof state.charactor === 'string', 'charactor is not string')

  const sizing = `width:${size}px;height:${size}px`

  return html`<span class="block bg-${state.color}" style="${sizing}">${state.charactor}</span>`
}

module.exports = block
