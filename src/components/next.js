const html = require('choo/html')

const block = require('./block')

const nextBlock = (state) => html`
  <div>${block(state)}</div>
`

module.exports = nextBlock
