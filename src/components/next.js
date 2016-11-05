const html = require('choo/html')

const block = require('./block')

const nextBlock = (state, size) => html`
  <div class="absolute" style="padding: .5em; right: 0;">${block(state, size)}</div>
`

module.exports = nextBlock
