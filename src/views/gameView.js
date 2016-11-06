const html = require('choo/html')

const board = require('../components/board')
const next = require('../components/next')
const skill = require('../components/skill')
const volume = require('../components/volume')
const end = require('../components/end')

module.exports = (state, prev, send) => {
  const endView = state.game.ended ? end(state, prev, send) : ''

  return html`
    <main class="relative container">
      <div class="relative height3">
        ${next(state.game.nextBlock, state.game.size)}
        ${skill(state, prev, send)}
        ${volume(state, prev, send)}
      </div>
      ${board(state, prev, send)}
      ${endView}
    </main>
  `
}
