const html = require('choo/html')

module.exports = (state, prev, send) => html`
  <div class="start">
    <button onclick=${(e) => send('game:start')}>NEW GAME!</button>
  </div>
`
