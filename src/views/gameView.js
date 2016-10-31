const html = require('choo/html')
const flatten = require('lodash.flatten')

const blocknboard = require('../components/blocknboard')
const board = require('../components/board')
const next = require('../components/next')

module.exports = (state, prev, send) => {
  const x = state.game.currentBlock.x * state.game.size
  const y = state.game.currentBlock.y * state.game.size
  const pos = `transform:translate(${x}px, ${-y}px)`

  return html`
    <main class="w-90 garamond center">
      <h1 class="f6 fw6 ttu tracked pb2 bb b--black-10 black-70">You have a pen</h1>
      <div class="relative pa3 h3">${next(state.game.nextBlock, state.game.size)}</div>
      <div class="relative">
        ${board(state, prev, send)}

        ${flatten(state.game.orderedBlocks).filter(b => !!b).map((b) => {
          const pos = `transform:translate(${b.x * state.game.size}px, ${-b.y * state.game.size}px)`
          return blocknboard(b, state.game.size, pos)
        })}

        ${blocknboard(state.game.currentBlock, state.game.size, pos)}
      </div>
      <div class="pa4">
        <button onclick=${(e) => send('game:start')}>NEW GAME</button>
      </div>
      <div>
        <div>
          ${Object.keys(state.result.details).map((key) => {
            return html`
              <div>
                <div>${key}: <span>${state.result.details[key]}</span></div>
              </div>
            `
          })}
        </div>
      </div>
    </main>
    
  `
}
