const html = require('choo/html')

const block = require('./block')

const nextBlock = (state, size) => html`
  <div>${block(state, size)}</div>
`

module.exports = nextBlock
