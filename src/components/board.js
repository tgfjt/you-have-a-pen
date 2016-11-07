const html = require('choo/html')
const flatten = require('lodash.flatten')

const blocknboard = require('../components/blocknboard')

const start = require('../components/start')

module.exports = (state, prev, send) => {
  const x = state.game.currentBlock.x * state.game.size
  const y = state.game.currentBlock.y * state.game.size
  const pos = `transform:translate(${x}px, ${-y}px)`
  const startView = !state.game.ended && !state.game.started ? start(state, prev, send) : ''
  const countup = (prev.result && (state.result.totalscore !== prev.result.totalscore)) ? ' is-active' : ''
  const shaking = state.game.waitingSkill ? ' is-shaking' : ''

  return html`
    <div class="board center${shaking}"
      style="width:${state.game.board.rows * state.game.size}px;height:${state.game.board.cols * state.game.size}px">
      <div class="board-score${countup}" style="top:0;right:0">${state.result.totalscore}</div>
      ${flatten(state.game.orderedBlocks).filter(b => !!b).map((b) => {
        const pos = `transform:translate(${b.x * state.game.size}px, ${-b.y * state.game.size}px)`
        const selected = (state.game.selectedBlock && state.game.selectedBlock.x === b.x && state.game.selectedBlock.y === b.y)
        return blocknboard(b, state.game.size, pos, selected, send)
      })}
      ${blocknboard(state.game.currentBlock, state.game.size, pos, false, send)}
      ${startView}
    </div>
  `
}
