const html = require('choo/html')

const skill = (state, prev, send) => {
  const skillColor = state.game.skill === 0 ? '#ccc' : '#7ecbcf'
  const textColor = state.game.skill === 0 ? '#ccc' : '#444'

  return html`
    <div class="absolute skill" onclick=${(e) => send('game:useSkill')}>
      <svg width="32" height="42" viewBox="63.75 33 33 32">
        <path fill="none" stroke="${skillColor}" stroke-width="2" d="M82.438 59.825a.44.44 0 0 1-.44.44H68.632a.44.44 0 0 1-.441-.44V46.462a.44.44 0 0 1 .441-.44h13.366a.44.44 0 0 1 .44.44v13.363z"/>
        <path fill="${skillColor}" stroke="${skillColor}" stroke-width="2" d="M91.265 52.521a.44.44 0 0 1-.441.44H77.458a.44.44 0 0 1-.44-.44V39.155a.44.44 0 0 1 .44-.441h13.366a.44.44 0 0 1 .441.441v13.366z"/>
        <text x="80" y="70" fill="${textColor}">${state.game.skill}</text>
      </svg>
    </div>
  `
}

module.exports = skill
