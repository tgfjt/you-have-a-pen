const html = require('choo/html')

const block = require('./block')

const nextBlock = (state) => {
  console.log(state)
  console.assert(typeof state.color === 'string', 'color is not string')
  console.assert(typeof state.char === 'string', 'char is not string')

  return html`
    <div>
      ${state.char}
    </div>
  `
}

module.exports = nextBlock
