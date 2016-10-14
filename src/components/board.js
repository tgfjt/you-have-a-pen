const html = require('choo/html')

const block = require('./block')

module.exports = (state, prev, send) => {

  return html`
    <div class="relative">
      ${state.board.blocks.map((rows, i) => {
        return html`
          <div>
            ${rows.map((cols, j) => {
            return html`<div class="center ba b--black-30 dib v-top">
                ${block({
                  row: i,
                  col: j,
                  color: '',
                  charactor: ''
                }, send)}
              </div>`
            })}
        </div>`
      })}
    </div>
  `
}
