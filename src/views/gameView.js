const html = require('choo/html')

const board = require('../components/board')
const next = require('../components/next')
const endView = require('../views/endView')

module.exports = (state, prev, send) => {
  if (state.game.ended) {
    return endView(state, prev, send)
  }

  return html`
    <main class="container">
      <div class="relative height3">${next(state.game.nextBlock, state.game.size)}</div>
      ${board(state, prev, send)}
      <div class="controller">
        ${Object.keys(state.result.details).map((key) => {
          return html`
            <div>
              <div>${key}: <span>${state.result.details[key]}</span></div>
            </div>
          `
        })}
        <div class="pad center">
          <div class="button pad-l" aria-label="to left" role="button" onclick=${(e) => send('game:handleLeft')}>◀</div>
          <div class="button pad-d" aria-label="to down" role="button" onclick=${(e) => send('game:handleDown')}>▼</div>
          <div class="button pad-r" aria-label="to right" role="button" onclick=${(e) => send('game:handleRight')}>▶</div>
        </div>
      </div>
    </main>
  `
}
