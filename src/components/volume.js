const html = require('choo/html')

const volume = (state, prev, send) => {
  const icon = state.game.volume ? html`<svg><use xlink:href="#volume"></use></svg>` : html`<svg><use xlink:href="#mute"></use></svg>`
  return html`<div class="absolute volume" onclick=${(e) => send('game:toggleVolume')}>
    ${icon}
  </div>`
}

module.exports = volume
