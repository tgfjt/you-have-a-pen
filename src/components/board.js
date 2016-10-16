const html = require('choo/html')
const css = require('sheetify')

const block = require('./block')
const prefix = css`
  .board {
    background: #aaa
  }
`

module.exports = (state, prev, send) => {
  return html`
    <div class=${prefix}>
      <div class="board"
        style="width:${state.game.board.rows * state.game.size}px;height:${state.game.board.cols * state.game.size}px">
      </div>
    </div>
  `
}
