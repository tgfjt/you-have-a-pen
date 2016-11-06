const html = require('choo/html')

const block = (state, size, send) => {
  if (!state.color || !state.charactor) {
    return ''
  }

  console.assert(typeof state.color === 'string', 'color is not string')
  console.assert(typeof state.charactor === 'string', 'charactor is not string')

  const sizing = `width:${size}px;height:${size}px`
  const blockStyle = state.current ? ' is-current' : ''

  return html`<span class="block bg-${state.color}${blockStyle}" style="${sizing}">${state.charactor}</span>`
}

module.exports = block
