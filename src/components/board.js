const html = require('choo/html')
const css = require('sheetify')

const prefix = css`
  .board {
    background: #aaa;
    position: relative
  }
  .board-score {
    position: absolute;
    margin: 0;
    padding: .5em;
  }
`

module.exports = (state, prev, send) => {
  return html`
    <div class=${prefix}>
      <div class="board"
        style="width:${state.game.board.rows * state.game.size}px;height:${state.game.board.cols * state.game.size}px">
        <h3 class="board-score" style="top:0;right:0">${state.result.totalscore}</h3>
      </div>
    </div>
  `
}
