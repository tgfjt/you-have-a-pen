const html = require('choo/html')

const board = require('../components/board')
const next = require('../components/next')

module.exports = (state, prev, send) => {

  return html`
    <main class="w-90 garamond center">
      <h1 class="f6 fw6 ttu tracked pb2 bb b--black-10 black-70">You have a pen</h1>
      <div>${next(state.game.next)}</div>
      ${board(state, prev, send)}
    </main>
  `
}
